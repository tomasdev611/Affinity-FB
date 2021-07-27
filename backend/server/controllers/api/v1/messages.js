import moment from 'moment';
import fs from 'fs';
import * as yup from 'yup';
import {token} from '../../../services/passport';
import {MessageService} from '../../../models/MessageService';
import {knexPool} from '../../../lib/knexPool';
import {AWSService} from '../../../services/aws';
import {PdfToImageService} from '../../../services/pdf';
import {wrapAsync} from '../../../lib/helpers';
import config from '../../../config';
const SecurityUser = require('../../../models/SecurityUser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = function(router) {
  router.get('/', token({required: true}), loadMessages);
  router.post('/', token({required: true}), sendMessage);
  router.post('/sms/hook/:division_db', twilioSMSHook);
  router.get('/chatrooms', token({required: true}), loadChatRooms);
  router.get('/unreads', token({required: true}), getUnreadCount);

  router.get('/groups', token({required: true}), loadGroups);
  router.post('/groups', token({required: true}), createGroup);
  router.get('/groups/:GroupId', token({required: true}), getSingleGroup);
  router.put('/groups/:GroupId', token({required: true}), wrapAsync(updateGroup));
  router.delete('/groups/:GroupId', token({required: true}), deleteGroup);

  router.get('/templates', token({required: true}), loadTemplates);
  router.post('/templates', token({required: true}), createTemplate);
  router.get('/templates/:templateId', token({required: true}), getSingleTemplate);
  router.put('/templates/:templateId', token({required: true}), updateTemplate);
  router.delete('/templates/:templateId', token({required: true}), deleteTemplate);
};

async function loadMessages(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);

    const loadMessageQuerySchema = yup.object({
      Phone: yup.string(),
      lastMessageId: yup.string(),
      GroupId: yup.string(),
      RoomId: yup.string(),
      loadPrevious: yup.boolean().default(false)
    });

    const data = await loadMessageQuerySchema.validate(req.query);

    const {Phone, lastMessageId, GroupId, RoomId, loadPrevious} = data;

    const {messages, noPreviousMessage} = await messageService.loadMessages({
      Phone,
      GroupId,
      RoomId,
      lastMessageId,
      loadPrevious
    });
    res.status(200).send({messages, noPreviousMessage});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const {target, message, GroupId, targetType} = req.body;
    const messageBody = {
      targetType,
      GroupId,
      target,
      message
    };
    if (req.files && req.files.file && req.files.file.path) {
      // const key = `${new Date().getUTCMilliseconds()}.jpg`;
      let type = req.files.file.type;
      let ext = 'jpg';
      let nameInfo = req.files.file.name.split('.');
      let filePath = req.files.file.path;
      if (nameInfo.length > 1) {
        ext = nameInfo[nameInfo.length - 1];
      }
      if (type === 'application/pdf') {
        filePath = await PdfToImageService.generateImageFromPDF(
          req.files.file.path,
          config.tempFolderPath
        );
        ext = 'png';
        type = 'image/png';
      }
      let key = `${moment().format('YYYY-MM')}/${new Date().getTime()}.${ext}`.toLowerCase();
      await AWSService.uploadImageToS3FromFilePath(filePath, key, type);
      if (type === 'application/pdf') {
        fs.unlinkSync(filePath);
      }
      messageBody.image = AWSService.s3UrlFor(key);
      // messageBody.imageMimeType = req.files.file.type;
    }
    // let attachment = fs.readFileSync(req.files.file.path, 'binary');
    const messageObj = await messageService.sendMessage(messageBody);
    res.status(200).send({message: messageObj});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function twilioSMSHook(req, res, next) {
  try {
    const knex = await knexPool.getKnex(req.params.division_db);
    const {To, MessagingServiceSid} = req.body;
    let user;
    if (MessagingServiceSid) {
    } else {
      user = await SecurityUser.query(knex).findOne({twilioNumber: To});
    }
    const messageService = new MessageService(knex, user, req.params.division_db);
    // req.division_db = info.division_db;

    await messageService.handleMessageHook(req.body);
    const twiml = new MessagingResponse();
    // twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

    // res.status(200).send({message: messageObj});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function loadGroups(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const groups = await messageService.loadGroups();
    res.status(200).send({groups});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function loadChatRooms(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const {chatrooms, totalCount, currentPage, pageSize} = await messageService.loadChatRooms(
      req.query
    );
    res.status(200).send({chatrooms, totalCount, currentPage, pageSize});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getUnreadCount(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const {chatrooms, totalUnreadCount} = await messageService.getUnreadCount();
    res.status(200).send({chatrooms, totalUnreadCount});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getSingleGroup(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const group = await messageService.getSingleGroup(req.params.GroupId);
    res.status(200).send({group});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function createGroup(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const group = await messageService.createGroup(req.body);
    res.status(200).send({group});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateGroup(req, res, next) {
  // try {
  const messageService = new MessageService(req.knex, req.user, req.division_db);
  const group = await messageService.updateGroup(req.params.GroupId, req.body);
  res.status(200).send({group});
  // } catch (error) {
  //   console.error('Error', error);
  //   res.status(500).send(error);
  // }
}

async function deleteGroup(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const messageObj = await messageService.removeGroup(req.params.GroupId);
    res.status(200).send({message: messageObj});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function loadTemplates(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const templates = await messageService.loadTemplates();
    res.status(200).send({templates});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getSingleTemplate(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const template = await messageService.getSingleTemplate(req.params.templateId);
    res.status(200).send({template});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function createTemplate(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const template = await messageService.createTemplate(req.body);
    res.status(200).send({template});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateTemplate(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    const template = await messageService.updateTemplate(req.params.templateId, req.body);
    res.status(200).send({template});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteTemplate(req, res, next) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    await messageService.removeTemplate(req.params.templateId);
    res.status(200).send({message: 'Successfully removed'});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
