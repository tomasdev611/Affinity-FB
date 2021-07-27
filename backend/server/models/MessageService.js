import {intersection, difference, uniq} from 'lodash';
import * as yup from 'yup';
import {transaction} from 'objection';
import createError from 'http-errors';
import moment from 'moment';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import config from '../config';
import {TwilioService} from '../services/twilio';
import {AWSService} from '../services/aws';
import {populateForCreateOnly, insertMultipleRows, canUserDoAction} from '../lib/helpers';
import Message from './MessageModel';
import MessageGroup from './MessageGroupModel';
import MessageGroupMember from './MessageGroupMember';
import MessageTemplate from './MessageTemplateModel';
import SecurityUser from './SecurityUser';
import Caregiver from './CaregiverModel';

const database = require('./../lib/databasemssql');

export class MessageService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    this.db = database.getDb();
  }

  async loadMessages({RoomId, GroupId, lastMessageId, loadPrevious}) {
    // const queryOption = {};
    // const twilioNumber = this.user.twilioNumber || config.twilio.defaultNumber;
    const messageQuery = Message.query(this.knex);
    if (GroupId) {
      messageQuery.where('RoomId', RoomId);
      messageQuery.leftJoin(
        'dbo.employee as e',
        'dbo.messages.SocialSecurityNum',
        'e.SocialSecurityNum'
      );
      messageQuery.select('dbo.messages.*', 'e.FirstName', 'e.LastName', 'e.SocialSecurityNum');
    } else {
      // if (!this.user.twilioNumber) {
      //   return [];
      // }
      // const phoneNumber = parsePhoneNumberFromString(Phone, 'US');
      // if (!phoneNumber || !phoneNumber.isValid()) {
      //   throw createError(400, 'Invalid phone number');
      // }
      // queryOption.twilioNumber = this.user.twilioNumber;
      // queryOption.targetNumber = phoneNumber.number;
      messageQuery.whereNull('GroupId');
      messageQuery.where('RoomId', RoomId);
      // messageQuery.where('twilioNumber', twilioNumber);
      // messageQuery.where('targetNumber', phoneNumber.number);
      // messageQuery.where('username', this.user.userName);
    }
    let noPreviousMessage = false;
    let shouldLimit = false;
    if (lastMessageId) {
      if (loadPrevious) {
        messageQuery.where('dbo.messages.MessageId', '<', parseInt(lastMessageId));
        messageQuery.orderBy('dbo.messages.MessageId', 'desc');
        messageQuery.limit(10);
        shouldLimit = true;
      } else {
        messageQuery.where('dbo.messages.MessageId', '>', parseInt(lastMessageId));
        messageQuery.orderBy('dbo.messages.MessageId', 'desc');
      }
    } else {
      messageQuery.limit(10);
      messageQuery.orderBy('dbo.messages.MessageId', 'desc');
      shouldLimit = true;
    }

    const messages = await messageQuery;
    const unreadMessageIds = messages.filter(m => m.isRead === false).map(m => m.MessageId);
    if (unreadMessageIds.length > 0) {
      await Message.query(this.knex)
        .patch({isRead: true})
        .whereIn('MessageId', unreadMessageIds);
    }
    if (shouldLimit) {
      if (messages.length < 10) {
        noPreviousMessage = true;
      }
    }
    return {messages, noPreviousMessage};
  }

  async sendMessage({targetType, GroupId, isCaregiver = true, target, message, image}) {
    if (targetType === 'group') {
      return await this.sendGroupMessage({GroupId, message, image});
    } else if (targetType === 'multi-users') {
      return await this.sendMessageToMultiplePersons({isCaregiver, target, message, image});
    } else {
      return await this.sendMessageToSinglePerson({isCaregiver, target, message, image});
    }
  }

  static getPhoneNumber(Phone) {
    if (!Phone) {
      return '';
    }
    const phoneNumber = parsePhoneNumberFromString(Phone, 'US');
    if (!phoneNumber || !phoneNumber.isValid()) {
      return '';
    } else {
      return phoneNumber.number;
    }
  }

  async sendGroupMessage({GroupId, message, image}) {
    if (!this.user.maximumGroupMemberCount) {
      throw createError('You are not allowed to send group message');
    }
    const messageGroup = await MessageGroup.query(this.knex).findById(GroupId);
    if (!messageGroup) {
      throw createError('Message not found');
    }
    this.validateGroupAbility(messageGroup.groupSize);
    const messageObj = {
      // twilioNumber: config.twilio.groupServiceSID,
      // targetNumber: config.twilio.groupNotifySID,
      GroupId,
      username: this.user.userName, // The username that's dealing with message
      sender: 'T',
      message,
      image
    };
    const caregivers = await MessageGroupMember.query(this.knex)
      .joinRelation('caregiver')
      .where('GroupId', GroupId)
      .select('caregiver.Phone1');
    const numbers = caregivers.map(c => MessageService.getPhoneNumber(c.Phone1)).filter(c => !!c);
    const twillioMessage = await TwilioService.sendBulkSMS(numbers, message, image);
    messageObj.MessageSid = twillioMessage.sid;
    messageObj.RoomId = MessageService.getRoomIdForMessage(messageObj);

    const messageInstance = await Message.query(this.knex).insert(
      populateForCreateOnly(this.user, messageObj)
    );
    return messageInstance;
  }

  async sendMessageToSinglePerson({isCaregiver = true, target, message, image}) {
    if (!this.user.twilioNumber) {
      throw createError(400, `You don't have phone number configured`);
    }
    const caregiver = await Caregiver.query(this.knex).findById(target);
    if (!caregiver) {
      throw createError(400, 'Target not found');
    }
    const phoneNumber = parsePhoneNumberFromString(caregiver.Phone1, 'US');
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw createError(400, 'Invalid phone number');
    }
    const messageObj = {
      twilioNumber: this.user.twilioNumber,
      targetNumber: phoneNumber.number,
      username: this.user.userName, // The username that's dealing with message
      SocialSecurityNum: target,
      sender: 'T',
      message,
      image
    };
    const twillioMessage = await TwilioService.sendSMS(
      messageObj.twilioNumber,
      messageObj.targetNumber,
      message,
      image
    );
    messageObj.MessageSid = twillioMessage.sid;
    messageObj.RoomId = MessageService.getRoomIdForMessage(messageObj);
    // messageObj.twilioNumber = twillioMessage.from;
    // if (isCaregiver) {
    //   messageObj.SocialSecurityNum = target.SocialSecurityNum;
    // } else {
    //   messageObj.ClientId = target.ClientId;
    // }
    // console.log('HELLO --', messageObj);
    const messageInstance = await Message.query(this.knex).insert(
      populateForCreateOnly(this.user, messageObj)
    );
    return messageInstance;
  }

  async sendMessageToMultiplePersons({isCaregiver = true, target, message, image}) {
    if (!this.user.twilioNumber) {
      throw createError(400, `You don't have phone number configured`);
    }
    const messageObj = {
      username: this.user.userName, // The username that's dealing with message
      twilioNumber: this.user.twilioNumber,
      sender: 'T',
      message: message || '',
      image: image || ''
    };
    const targets = target.split(',');
    if (targets.length > 10) {
      throw createError(400, `You can not send message to more than 10 people at once`);
    }
    let caregivers = await Caregiver.query(this.knex)
      .whereIn('SocialSecurityNum', targets)
      .select('SocialSecurityNum', 'Phone1Formatted', 'Phone1');
    const targetNumbers = [];
    caregivers = caregivers.filter(caregiver => {
      if (caregiver.Phone1Formatted) {
        targetNumbers.push(caregiver.Phone1Formatted);
        return true;
      } else if (caregiver.Phone1) {
        try {
          const phoneNumber = parsePhoneNumberFromString(caregiver.Phone1, 'US');
          if (phoneNumber && phoneNumber.isValid()) {
            targetNumbers.push(phoneNumber.number);
            caregivers.Phone1Formatted = phoneNumber.number;
            return true;
          }
        } catch (error) {}
      }
      return false;
    });
    const data = [];
    for (let i = 0; i < caregivers.length; i++) {
      try {
        const caregiver = caregivers[i];
        const twillioMessage = await TwilioService.sendSMS(
          messageObj.twilioNumber,
          caregiver.Phone1Formatted,
          message,
          image
        );
        const newMesageObj = {
          ...messageObj,
          MessageSid: twillioMessage.sid,
          targetNumber: caregiver.Phone1Formatted,
          SocialSecurityNum: caregiver.SocialSecurityNum
        };
        newMesageObj.RoomId = MessageService.getRoomIdForMessage(newMesageObj);
        data.push(populateForCreateOnly(this.user, newMesageObj));
      } catch (error) {
        console.error(error);
      }
    }
    if (data.length > 0) {
      await insertMultipleRows(
        this.db,
        this.division_db,
        'dbo.messages',
        [
          'twilioNumber',
          'targetNumber',
          'username',
          'sender',
          'message',
          'MessageSid',
          'SocialSecurityNum',
          'image',
          'createdBy',
          'created'
        ],
        data,
        5
      );
    }
    return data;
  }

  /***
   * {"ToCountry":"US","MediaContentType0":"image/jpeg","ToState":"FL","SmsMessageSid":"MM506b03c304344e2f6d642c6ed9d6c7cc",
   * "NumMedia":"1","ToCity":"","FromZip":"10038","SmsSid":"MM506b03c304344e2f6d642c6ed9d6c7cc","FromState":"NY",
   * "SmsStatus":"received","FromCity":"NEW YORK","Body":"","FromCountry":"US","To":"+19547154985","ToZip":"",
   * "NumSegments":"1","MessageSid":"MM506b03c304344e2f6d642c6ed9d6c7cc","AccountSid":"AC6457622eb5f7e8818741c4d489941774",
   * "From":"+19172720828",
   * "MediaUrl0":"https://api.twilio.com/2010-04-01/Accounts/AC6457622eb5f7e8818741c4d489941774/Messages/MM506b03c304344e2f6d642c6ed9d6c7cc/Media/ME195e4ad7ecb097f4f7c3760441d85a79",
   * "ApiVersion":"2010-04-01"}
   */
  async handleMessageHook(body) {
    const {MessageSid, MessagingServiceSid, From, To, Body, NumMedia} = body;
    const messageObj = {
      twilioNumber: To,
      targetNumber: From,
      sender: 'C',
      message: Body,
      MessageSid: MessageSid,
      isRead: false
    };
    if (this.user) {
      messageObj.username = this.user.userName;
    }
    const caregiver = await Caregiver.query(this.knex).findOne({Phone1Formatted: From});
    if (!caregiver) {
      return;
    }
    messageObj.SocialSecurityNum = caregiver.SocialSecurityNum;
    if (MessagingServiceSid && MessagingServiceSid === config.twilio.groupServiceSID) {
      // Then it's group message. Find proper group.
      const groups = await MessageGroupMember.query(this.knex).where(
        'SocialSecurityNum',
        caregiver.SocialSecurityNum
      );
      if (groups.length === 0) {
        return;
      }
      const groupIds = uniq(groups.map(group => group.GroupId));
      const lastMessage = await Message.query(this.knex)
        .whereIn('GroupId', groupIds)
        .orderBy('MessageId', 'desc')
        .limit(1);
      if (lastMessage && lastMessage.length > 0) {
        messageObj.GroupId = lastMessage[0].GroupId;
      } else {
        return;
      }
    }
    if (!MessagingServiceSid) {
      const securityUser = await SecurityUser.query(this.knex).findOne({twilioNumber: To});
      if (securityUser) {
        messageObj.username = securityUser.userName;
      }
    }

    if (NumMedia && NumMedia > 0) {
      const imageUrl = body[`MediaUrl0`];
      let key = `${moment().format(
        'YYYY-MM'
      )}/${new Date().getUTCMilliseconds()}.jpg`.toLowerCase();
      await AWSService.uploadImageToS3FromUrl(imageUrl, key);
      messageObj.image = AWSService.s3UrlFor(key);
    }
    messageObj.RoomId = MessageService.getRoomIdForMessage(messageObj);
    // if (isCaregiver) {
    //   messageObj.SocialSecurityNum = target.SocialSecurityNum;
    // } else {
    //   messageObj.ClientId = target.ClientId;
    // }
    const messageInstance = await Message.query(this.knex).insert(
      populateForCreateOnly(this.user || {userName: 'Unkown'}, messageObj)
    );
    return messageInstance;
  }

  async loadGroups() {
    const groups = await MessageGroup.query(this.knex).orderBy('GroupId', 'asc');
    // const groupMembers = await MessageGroupMember.query(this.knex);
    // groups.forEach(group => {
    //   group.members = groupMembers.filter(gm => gm.GroupId === group.GroupId);
    // });
    return groups;
  }

  async getSingleGroup(GroupId) {
    const group = await MessageGroup.query(this.knex).findOne({GroupId});
    if (!group) {
      throw createError(404, 'Group not found');
    }
    const groupMembers = await MessageGroupMember.query(this.knex).where('GroupId', GroupId);
    if (group.isCaregiverGroup) {
      group.members = groupMembers.map(gm => gm.SocialSecurityNum);
    } else {
      group.members = groupMembers.map(gm => gm.ClientId);
    }
    return group;
  }

  validateGroupAbility(groupSize) {
    if (!this.user.maximumGroupMemberCount) {
      throw createError(400, 'You are not allowed to manage a group');
    }
    if (this.user.maximumGroupMemberCount < groupSize) {
      throw createError(
        400,
        `You are not allowed to manage a group bigger than ${this.user.maximumGroupMemberCount}`
      );
    }
  }

  async createGroup(body) {
    const {name, members, isCaregiverGroup = true} = body;
    this.validateGroupAbility(members.length);
    const lastGroup = await MessageGroup.query(this.knex)
      .orderBy('GroupId', 'desc')
      .limit(1);
    let GroupId = '0001';
    if (lastGroup && lastGroup.length > 0) {
      GroupId = (parseInt(lastGroup[0].GroupId, 36) + 1).toString(36).padStart(4, '0');
    }

    const newGroup = {
      GroupId,
      name,
      isCaregiverGroup,
      groupSize: members.length
    };

    const group = await MessageGroup.query(this.knex).insert(newGroup);
    if (members && members.length > 0) {
      const groupMembers = members.map(user => ({
        GroupId,
        SocialSecurityNum: user
      }));

      await insertMultipleRows(
        this.db,
        this.division_db,
        'dbo.messageGroupMembers',
        ['GroupId', 'SocialSecurityNum'],
        groupMembers
      );

      // const sql = `use [${this.division_db}];${multiRowsInsertHelper('dbo.messageGroupMembers', ['GroupId', 'SocialSecurityNum'], groupMembers)}`;

      // await new Promise((resolve, reject) => {
      //   this.db
      //   .request()
      //   .query(sql)
      //   .then(result => {
      //     resolve(result.recordset[0]);
      //   })
      //   .catch(err => {
      //     console.trace(err); // todo : will do to logger later
      //     reject(err);
      //   });
      // })

      // await transaction(this.knex, async trx => {
      //   // Here you can use the transaction.

      //   // Whatever you return from the transaction callback gets returned
      //   // from the `transaction` function.
      //   for (let i = 0; i < groupMembers.length; i++) {
      //     await MessageGroupMember.query(trx).insert(groupMembers[i]);
      //   }
      //   return '';
      // });
    }
    group.members = members || [];
    return group;
  }

  async updateGroup(GroupId, body) {
    const {name, members} = body;
    const updateObj = {
      name
    };
    if (members) {
      updateObj.groupSize = members.length;
      this.validateGroupAbility(members.length);
    }
    const group = await MessageGroup.query(this.knex).updateAndFetchById(GroupId, updateObj);

    if (members) {
      if (group.isCaregiverGroup) {
        const currentMembers = await MessageGroupMember.query(this.knex)
          .where('GroupId', GroupId)
          .map(groupUser => groupUser.SocialSecurityNum);

        const membersToDelete = difference(currentMembers, members);
        if (membersToDelete.length > 0) {
          await MessageGroupMember.query(this.knex)
            .where('GroupId', GroupId)
            .whereIn('SocialSecurityNum', membersToDelete)
            .delete();
        }
        const membersToAdd = difference(members, currentMembers);

        if (membersToAdd.length > 0) {
          const groupMembers = membersToAdd.map(user => ({
            GroupId,
            SocialSecurityNum: user
          }));
          // const chunkSize = 30;
          await transaction(this.knex, async trx => {
            for (let i = 0; i < groupMembers.length; i++) {
              await MessageGroupMember.query(trx).insert(groupMembers[i]);
            }
            return '';
          });
        }
      }
    }
    group.members = members;
    return group;
  }

  async removeGroup(GroupId) {
    await MessageGroup.query(this.knex)
      .where('GroupId', GroupId)
      .delete();
    await MessageGroupMember.query(this.knex)
      .where('GroupId', GroupId)
      .delete();
  }

  async loadTemplates() {
    const templates = await MessageTemplate.query(this.knex).orderBy('name', 'asc');
    return templates;
  }

  async getSingleTemplate(templateId) {
    const template = await MessageTemplate.query(this.knex).findById(templateId);
    if (!template) {
      throw createError(404, 'Template not found');
    }
    return template;
  }

  async createTemplate(body) {
    const {name, message} = body;
    const template = await MessageTemplate.query(this.knex).insert({name, message});
    return template;
  }

  async updateTemplate(templateId, body) {
    const {name, message} = body;
    const template = await MessageTemplate.query(this.knex).updateAndFetchById(templateId, {
      name,
      message
    });
    return template;
  }

  async removeTemplate(templateId) {
    await MessageTemplate.query(this.knex)
      .where('id', templateId)
      .delete();
  }

  static getRoomIdForMessage(message) {
    let RoomId = message.GroupId;
    if (!RoomId) {
      if (message.username && message.SocialSecurityNum) {
        RoomId = `${message.username}-${message.SocialSecurityNum}`;
      }
    }
    return RoomId;
  }

  async updateMessageSocialSecurityNum() {
    const targetNumbers = await Message.query(this.knex)
      .whereNull('SocialSecurityNum')
      .whereNotNull('targetNumber')
      .groupBy('targetNumber')
      .select('targetNumber');

    for (let targetGroup of targetNumbers) {
      const caregiver = await Caregiver.query(this.knex)
        .findOne({Phone1Formatted: targetGroup.targetNumber})
        .select('SocialSecurityNum');
      if (caregiver) {
        await Message.query(this.knex)
          .where('targetNumber', targetGroup.targetNumber)
          .update({
            SocialSecurityNum: caregiver.SocialSecurityNum
          });
      }
    }
  }

  async updateMessageRoomId() {
    const targetGroupRooms = await Message.query(this.knex)
      .whereNull('RoomId')
      .whereNotNull('GroupId')
      .groupBy('GroupId')
      .select('GroupId');
    for (let targetGroupRoom of targetGroupRooms) {
      await Message.query(this.knex)
        .where('GroupId', targetGroupRoom.GroupId)
        .update({
          RoomId: targetGroupRoom.GroupId
        });
    }

    const targetIndividualRooms = await Message.query(this.knex)
      .whereNull('RoomId')
      .whereNull('GroupId')
      .whereNotNull('username')
      .whereNotNull('SocialSecurityNum')
      .groupByRaw('username, SocialSecurityNum')
      .select('username', 'SocialSecurityNum');

    for (let targetIndividualRoom of targetIndividualRooms) {
      await Message.query(this.knex)
        .where('username', targetIndividualRoom.username)
        .where('SocialSecurityNum', targetIndividualRoom.SocialSecurityNum)
        .update({
          RoomId: `${targetIndividualRoom.username}-${targetIndividualRoom.SocialSecurityNum}`
        });
    }
  }

  async loadChatRooms(params) {
    const loadChatRoomsSchema = yup.object({
      pageSize: yup.number().default(10),
      currentPage: yup.number().default(1),
      type: yup.string().default('ALL'),
      sourceType: yup.string().default('OWN'),
      securityUserName: yup.string(),
      phoneNumber: yup.string()
    });

    const {
      pageSize = 10,
      currentPage = 1,
      type = 'ALL',
      sourceType,
      securityUserName,
      phoneNumber
    } = await loadChatRoomsSchema.validate(params);
    let filters = ['RoomId is not null'];
    let usernameFilter;
    if (canUserDoAction(this.user, 'Administrator', 'read')) {
      if (sourceType === 'OWN') {
        usernameFilter = `username = '${this.user.userName}'`;
      } else if (sourceType === 'USERNAME') {
        if (!securityUserName) {
          throw createError(404, 'Security User needs to be selected');
        }
        usernameFilter = `username = '${securityUserName}'`;
      } else if (sourceType === 'PHONE') {
        if (!phoneNumber) {
          throw createError(404, 'Phone number needs to be selected');
        }
        usernameFilter = `twilioNumber = '${phoneNumber}'`;
      }
    } else {
      usernameFilter = `username = '${this.user.userName}'`;
    }
    if (type === 'GROUP') {
      // Group does not belong to specific user. We show all.
      filters.push(`GroupId is not null`);
    } else if (type === 'INDIVIDUAL') {
      filters.push(`GroupId is null`);
      if (usernameFilter) {
        filters.push(usernameFilter);
      }
    } else {
      // This means all Group and Individual
      if (usernameFilter) {
        filters.push(`((GroupId is not null) or (GroupId is null and ${usernameFilter}))`);
      }
    }

    let mainQuery = `SELECT RoomId, MAX(MessageId) as MessageId, COUNT(*) as totalMessageCount, SUM(CASE WHEN isRead = 0 THEN 1 ELSE 0 END) as unreadCount FROM dbo.messages where ${filters.join(
      ' and '
    )}`;
    const sql = `use [${this.division_db}]; select * from (SELECT A.*, B.totalMessageCount, B.unreadCount, ROW_NUMBER() OVER (order by A.MessageId desc) as RowNum FROM dbo.messages as A inner join (${mainQuery} group by RoomId) as B on A.RoomId = B.RoomId and A.MessageId=B.MessageId) as C where C.RowNum <= ${currentPage *
      pageSize} and C.RowNum > ${(currentPage - 1) * pageSize} order by C.MessageId desc`;
    const result = await new Promise((resolve, reject) => {
      this.db
        .request()
        .query(sql)
        .then(result => {
          resolve(result.recordset);
        })
        .catch(err => {
          console.trace(err); // todo : will do to logger later
          reject(err);
        });
    });

    let totalCount = 0;
    if (currentPage === 1) {
      const sql = `use [${this.division_db}]; select count(distinct RoomId) as totalCount from dbo.messages where ${filters.join(
        ' and '
      )}`;
      const result = await new Promise((resolve, reject) => {
        this.db
          .request()
          .query(sql)
          .then(result => {
            resolve(result.recordset);
          })
          .catch(err => {
            console.trace(err); // todo : will do to logger later
            reject(err);
          });
      });
      if (result) {
        totalCount = result[0].totalCount;
      }
    }

    const groupIds = result.filter(m => m.GroupId).map(m => m.GroupId);
    const socialSecurityNums = result
      .filter(m => m.SocialSecurityNum)
      .map(m => m.SocialSecurityNum);
    if (groupIds && groupIds.length > 0) {
      const groups = await MessageGroup.query(this.knex).findByIds(groupIds);
      const groupMap = groups.reduce((obj, cur) => {
        obj[cur.GroupId] = cur;
        return obj;
      }, {});
      result.forEach(m => {
        if (m.GroupId && groupMap[m.GroupId]) {
          m.Group = groupMap[m.GroupId];
        }
      });
    }
    if (socialSecurityNums && socialSecurityNums.length > 0) {
      const caregivers = await Caregiver.query(this.knex).findByIds(socialSecurityNums);
      const caregiverMap = caregivers.reduce((obj, cur) => {
        obj[cur.SocialSecurityNum] = cur;
        return obj;
      }, {});
      result.forEach(m => {
        if (m.SocialSecurityNum && caregiverMap[m.SocialSecurityNum]) {
          m.caregiver = caregiverMap[m.SocialSecurityNum];
        }
      });
    }
    return {chatrooms: result, totalCount, currentPage, pageSize};
  }

  async getUnreadCount() {
    let filters = ['RoomId is not null'];
    filters.push(`GroupId is null`);
    filters.push(`isRead = 0`);
    filters.push(`username = '${this.user.userName}'`);

    const result = await Message.query(this.knex)
      .select(this.knex.raw(`COUNT(*) as unreadCount, RoomId`))
      .whereNotNull('RoomId')
      .whereNull('GroupId')
      .where('isRead', 0)
      .where('username', this.user.userName)
      .groupBy('RoomId');
    const totalUnreadCount = result.reduce((val, cur) => val + cur.unreadCount, 0);

    return {chatrooms: result, totalUnreadCount};
  }
}

/*
MessageSid	A 34 character unique identifier for the message. May be used to later retrieve this message from the REST API.
SmsSid	Same value as MessageSid. Deprecated and included for backward compatibility.
AccountSid	The 34 character id of the Account this message is associated with.
MessagingServiceSid	The 34 character id of the Messaging Service associated with the message.
From	The phone number or Channel address that sent this message.
To	The phone number or Channel address of the recipient.
Body	The text body of the message. Up to 1600 characters long.
NumMedia	The number of media items associated with your message

FromCity	The city of the sender
FromState	The state or province of the sender.
FromZip	The postal code of the called sender.
FromCountry	The country of the called sender.
ToCity	The city of the recipient.
ToState	The state or province of the recipient.
ToZip	The postal code of the recipient.
ToCountry	The country of the recipient.
*/
