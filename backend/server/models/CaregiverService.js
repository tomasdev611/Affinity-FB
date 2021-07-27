import {intersection, difference, uniq, pick} from 'lodash';
import {lit} from 'objection';
// import {transaction} from 'objection';
import Knex from 'knex';
import createError from 'http-errors';
import fs from 'fs';
import * as yup from 'yup';
import {
  distanceFieldGenerator,
  generateAddressHash,
  populateForCreate,
  populateForUpdate,
  generateRandomIds
} from '../lib/helpers';

import {GoogleMapService} from '../services/googlemap';
import {FEEDBACK_OPTIONS} from '../lib/constants';
import Schedule from './ScheduleModel';
import {MessageService} from './MessageService';
import Caregiver from './CaregiverModel';
import Applicant from './ApplicantModel';
import CaregiverCustomField from './CaregiverCustomField';

import CaregiverAttachment from './CaregiverAttachment';
import CaregiverLanguage from './CaregiverLanguageModel';
import CaregiverSkill from './CaregiverSkillModel';
import CaregiverNote from './CaregiverNote';
import CaregiverReminder from './CaregiverReminder';
import Availability from './AvailabilityModel';
import CaregiverAvailability from './CaregiverAvailabilityModel';
import Reminder from './ReminderModel';

import Classification from './ClassificationModel';

import CustomField from './CustomField';
import Client from './ClientModel';
import {AWSService, ACL_PUBLIC_READ} from '../services/aws';

const database = require('./../lib/databasemssql');

export const caregiverSearchSchema = yup.object({
  ClientId: yup.string().required('Client is required'),
  sort: yup.string(),
  sortDirection: yup.string(),
  status: yup.string(),
  proximity: yup
    .number()
    .min(1)
    .max(10000),
  minRating: yup.number(),
  minFeedback: yup.string(),
  classificationID: yup.string(),
  language: yup.string(),
  languageOption: yup.string(),
  co: yup.string(),
  coOption: yup.string(),
  skills: yup.array().of(yup.string()),
  dayFrom: yup.string(),
  dateTo: yup.string(),
  gender: yup.string().oneOf(['M', 'F', '']),
  AvailabilityId: yup.number(),
  days: yup.object()
});

export const caregiverBasicSchema = yup.object({
  FirstName: yup.string(),
  LastName: yup.string(),
  MiddleInit: yup.string().max(1),
  Address1: yup.string(),
  Address2: yup.string(),
  City: yup.string(),
  County: yup.string(),
  State: yup.string(),
  Zip: yup.string(),
  lat: yup.number(),
  lng: yup.number(),
  addressHash: yup.string(),
  photo: yup.string(),
  ValidDriversLicense: yup.boolean(),

  Smoker: yup.boolean(),
  WeightRestriction: yup.boolean(),
  WeightLimit: yup.number(),
  ClassificationID: yup.number(),
  DateofBirth: yup.string(),
  Status: yup.string(),
  StatusDate: yup.string(),
  InactiveDate: yup.string(),
  Email: yup.string(),
  QuickbooksId: yup.string(),
  CertExpirationDate: yup.string(),
  Certification: yup.string(),
  payOvertime: yup.boolean(),
  CreateQbTSheets: yup.boolean(),
  Phone1: yup.string(),
  Phone1Formatted: yup.string(),
  Phone2: yup.string(),
  BackgroundCheck: yup.boolean(),
  className: yup.string(),
  notes: yup.string(),
  independentContractor: yup.boolean(),
  telephonyID: yup.string(),
  doNotRehire: yup.boolean(),
  paychexID: yup.string(),
  NPI: yup.string(),
  // int_statusid: yup.number(),
  str_reason: yup.string(),
  str_Gender: yup.string()
  // MessageID: yup.number().nullable()
});

export const caregiverSecurityNumberSchema = yup.object({
  SocialSecurityNum: yup
    .string()
    .required('Social security number is required')
    .length(9, 'Invalid social security number')
});

export const caregiverSecurityNumberNonRequiredSchema = yup.object({
  SocialSecurityNum: yup.string().length(9, 'Invalid social security number')
});

export const caregiverAddSchema = caregiverBasicSchema.concat(caregiverSecurityNumberSchema);
export const caregiverUpdateSchema = caregiverBasicSchema.concat(
  caregiverSecurityNumberNonRequiredSchema
);

export class CaregiverService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    this.db = database.getDb();
  }

  /**
   * Search Caregivers.
   * Sort: Distance, #of Visits, Reg. Date, Rating, Feedback
   * Filters:
   * Active, Inactive (Caregiver)
   * Proximity (Caregiver, Calculate distance)
   * Min Rating - (Caregiver, NPI's first character value (NPI - R-LCE, first one is rating. 1~5))
   * Feedback - (Custom Fields, Feedback)
   * Classification - (Caregiver, ClassificationID)
   * Schedule Filter - (Schedule Model, Date, StartTime, EndTime)
   * Language - (CaregiverLanguage)
   * CO - (Caregiver, className)
   */
  async searchCaregivers(rawData) {
    const data = await caregiverSearchSchema.validate(rawData, {stripeUnknown: true});
    const {
      ClientId,
      sort,
      sortDirection,
      status,
      proximity,
      minRating,
      minFeedback,
      classificationID,
      language,
      languageOption,
      co,
      coOption,
      skills,
      dateFrom,
      dateTo,
      days,
      gender,
      AvailabilityId
    } = data;
    const client = await Client.query(this.knex).findById(ClientId);
    if (!client) {
      throw createError(400, 'Client not found');
    }
    if (!client.lat) {
      throw createError(400, 'Client does not have geolocation data');
    }

    const caregiverQuery = Caregiver.query(this.knex);

    const selectDistanceQuery = distanceFieldGenerator(client.lat, client.lng, 'lat', 'lng');
    caregiverQuery.select(
      Knex.raw(`SocialSecurityNum, lat , lng, ${selectDistanceQuery} as distance`)
    );
    if (status && status !== 'all') {
      caregiverQuery.where('Status', status);
    }
    if (minRating) {
      caregiverQuery.where('NPI', '>=', `${minRating}`);
    }
    if (classificationID) {
      const classificationIDs = classificationID.split(',');
      if (classificationIDs.length > 1) {
        caregiverQuery.whereIn('ClassificationID', classificationIDs.map(c => parseInt(c, 10)));
      } else {
        caregiverQuery.where('ClassificationID', parseInt(classificationID));
      }
    } else {
      const termClassification = await Classification.query(this.knex).findOne({
        Description: 'TERM'
      });
      if (termClassification) {
        caregiverQuery.whereNot('ClassificationID', termClassification.ClassificationID);
      }
    }

    if (co) {
      if (coOption === 'exclude') {
        caregiverQuery.whereNot('className', co);
      } else {
        caregiverQuery.where('className', co);
      }
    }

    if (proximity) {
      caregiverQuery.whereRaw(`${selectDistanceQuery} <= ${proximity}`);
    }

    if (gender) {
      caregiverQuery.where('str_Gender', gender);
    }
    if (sort === 'distance') {
      caregiverQuery.orderBy(sort, 'asc');
    } else if (sort === 'rating') {
      caregiverQuery.orderBy('NPI', 'desc');
    } else if (sort === 'regdate') {
      caregiverQuery.orderBy('StatusDate', 'desc');
    }
    let caregivers = await caregiverQuery;

    if (language) {
      const languageCaregivers = await CaregiverLanguage.query(this.knex).where(
        'LanguageId',
        language
      );
      const caregiverIds = languageCaregivers.map(lc => lc.SocialSecurityNum);
      if (languageOption === 'exclude') {
        caregivers = caregivers.filter(c => !caregiverIds.includes(c.SocialSecurityNum));
      } else {
        caregivers = caregivers.filter(c => caregiverIds.includes(c.SocialSecurityNum));
      }
    }

    if (AvailabilityId) {
      const availabilityCaregivers = await CaregiverAvailability.query(this.knex).where(
        'AvailabilityId',
        AvailabilityId
      );
      const caregiverIds = availabilityCaregivers.map(lc => lc.SocialSecurityNum);
      caregivers = caregivers.filter(c => caregiverIds.includes(c.SocialSecurityNum));
    }

    if (skills && skills.length > 0) {
      const caregiverWithSkills = await CaregiverSkill.query(this.knex)
        .select(
          Knex.raw(`
      COUNT(*) as count,
      SocialSecurityNum
      `)
        )
        .whereIn('SkillId', skills)
        .groupBy('SocialSecurityNum');
      // .having('count', skills.length);
      const skillsLength = skills.length;
      const caregiverIds = caregiverWithSkills
        .filter(lc => lc.count === skillsLength)
        .map(lc => lc.SocialSecurityNum);
      caregivers = caregivers.filter(c => caregiverIds.includes(c.SocialSecurityNum));
    }

    if (dateFrom && dateTo && days && Object.keys(days).length > 0) {
      // if (schedules.dateFrom && schedules.dateTo) {
      //   const
      // }
      const queries = [];
      for (let i = 0; i < 7; i++) {
        if (days[`day${i}`] && days[`day${i}`].start && days[`day${i}`].end) {
          const {start, end} = days[`day${i}`];
          const query = `(DATEPART(weekday,Date) = ${i +
            1} and CONVERT(VARCHAR(5), StartTime, 108) < '${end}' and CONVERT(VARCHAR(5), EndTime, 108) > '${start}')`;
          queries.push(query);
        }
      }

      if (queries.length > 0) {
        const scheduleQuery = Schedule.query(this.knex)
          .whereRaw(
            `CONVERT(VARCHAR(10), Date, 102) >= '${dateFrom
              .split('-')
              .join('.')}' and CONVERT(VARCHAR(10), Date, 102) <= '${dateTo.split('-').join('.')}'`
          )
          .andWhereRaw(`(${queries.join(' or ')})`)
          .select(Knex.raw('distinct SocialSecNum'));
        const schedules = await scheduleQuery;
        if (schedules.length > 0) {
          const caregiverIds = schedules.map(lc => lc.SocialSecNum);
          caregivers = caregivers.filter(c => !caregiverIds.includes(c.SocialSecurityNum));
        }
      }
    }

    if (minFeedback || sort === 'feedback') {
      // F, U, C, B, A
      let caregiverCustomFieldsQuery = CaregiverCustomField.query(this.knex).where(
        'cfieldName',
        'Feedback'
      );
      if (minFeedback) {
        let getIndex = FEEDBACK_OPTIONS.findIndex((value, index) => {
          return value === minFeedback;
        });
        if (getIndex > -1) {
          let feedbacks = FEEDBACK_OPTIONS.slice(getIndex);
          caregiverCustomFieldsQuery.whereIn('descr', feedbacks);
        }
      }
      if (sort === 'feedback') {
        caregiverCustomFieldsQuery.select('SocialSecNum', 'descr');
      } else {
        caregiverCustomFieldsQuery.select('SocialSecNum');
      }
      let caregiverCustomFields = await caregiverCustomFieldsQuery;

      if (minFeedback) {
        const caregiverIds = caregiverCustomFields.map(lc => lc.SocialSecNum);
        caregivers = caregivers.filter(c => caregiverIds.includes(c.SocialSecurityNum));
      }

      if (sort === 'feedback') {
        const feedbackMap = {
          A: [],
          B: [],
          C: [],
          U: [],
          F: [],
          OTHER: []
        };
        const caregiverMap = {};

        caregiverCustomFields.forEach(c => {
          if (feedbackMap[c.descr]) {
            feedbackMap[c.descr].push(c.SocialSecNum);
          } else {
            feedbackMap['OTHER'].push(c.SocialSecNum);
          }
        });
        caregivers.forEach(c => {
          caregiverMap[c.SocialSecurityNum] = c;
        });

        const caregiverIds = [
          ...feedbackMap.A,
          ...feedbackMap.B,
          ...feedbackMap.C,
          ...feedbackMap.U,
          ...feedbackMap.F,
          ...feedbackMap.OTHER
        ];
        caregivers = caregiverIds.filter(c => caregiverMap[c]).map(c => caregiverMap[c]);
        // caregivers.filter(c => caregiverIds.includes(c.SocialSecurityNum));
      }
    }

    if (sort === 'visits') {
      const visitData = await Schedule.query(this.knex)
        .select(
          Knex.raw(`
        COUNT(*) as total_visits,
        SocialSecNum
      `)
        )
        .groupBy('SocialSecNum')
        .orderBy('total_visits', 'desc');
      const caregiverMap = {};
      caregivers.forEach(c => {
        caregiverMap[c.SocialSecurityNum] = c;
      });
      caregivers = visitData
        .filter(c => caregiverMap[c.SocialSecNum])
        .map(c => caregiverMap[c.SocialSecNum]);
    }
    return caregivers;
  }

  async getCaregiverDataForSearch(ClientId, caregiverIds) {
    const client = await Client.query(this.knex).findById(ClientId);
    if (!client) {
      throw createError(400, 'Client not found');
    }
    if (!client.lat) {
      throw createError(400, 'Client does not have geolocation data');
    }
    const selectDistanceQuery = distanceFieldGenerator(client.lat, client.lng, 'lat', 'lng');

    const caregivers = await Caregiver.query(this.knex)
      .whereIn('SocialSecurityNum', caregiverIds)
      .select(Knex.raw(`*, ${selectDistanceQuery} as distance`));
    const caregiverMap = caregivers.reduce((obj, cur) => {
      obj[cur.SocialSecurityNum] = cur;
      cur.skills = [];
      cur.languages = [];
      cur.attachments = [];
      cur.notes = [];
      cur.reminders = [];
      return obj;
    }, {});

    const activeCustomFieldsForCaregiver = await CustomField.query(this.knex).where({
      showCaregiver: true
    });
    let cfieldsNames = activeCustomFieldsForCaregiver.map(field => field.cfieldName);
    const caregiverFields = await CaregiverCustomField.query(this.knex)
      .select('cfieldName', 'descr', 'SocialSecNum')
      .whereIn('cfieldName', cfieldsNames)
      .whereIn('SocialSecNum', caregiverIds);
    caregiverFields.forEach(cf => {
      let caregiver = caregiverMap[`${cf.SocialSecNum}`];
      if (caregiver) {
        caregiver[cf.cfieldName] = cf.descr;
      }
    });

    const attachments = await CaregiverAttachment.query(this.knex)
      .whereIn('socialSecNum', caregiverIds)
      .select('socialSecNum', 'attachmentId', 'descr');
    attachments.forEach(cf => {
      let caregiver = caregiverMap[`${cf.socialSecNum}`];
      if (caregiver) {
        caregiver.attachments.push(cf);
      }
    });
    const languages = await CaregiverLanguage.query(this.knex).whereIn(
      'SocialSecurityNum',
      caregiverIds
    );
    languages.forEach(cf => {
      let caregiver = caregiverMap[`${cf.SocialSecurityNum}`];
      if (caregiver) {
        caregiver.languages.push(cf);
      }
    });
    const skills = await CaregiverSkill.query(this.knex).whereIn('SocialSecurityNum', caregiverIds);
    skills.forEach(cf => {
      let caregiver = caregiverMap[`${cf.SocialSecurityNum}`];
      if (caregiver) {
        caregiver.skills.push(cf);
      }
    });

    const visitData = await Schedule.query(this.knex)
      .select(
        Knex.raw(`
      COUNT(DISTINCT ClientId) as total_clients,
      COUNT(*) as total_visits,
      MIN(dbo.schedules.Date) as first_visit,
      SocialSecNum
    `)
      )
      .whereIn('SocialSecNum', caregiverIds)
      .groupBy('SocialSecNum');
    visitData.forEach(visitInfo => {
      let caregiver = caregiverMap[`${visitInfo.SocialSecNum}`];
      if (caregiver) {
        Object.assign(caregiver, pick(visitInfo, ['total_clients', 'total_visits', 'first_visit']));
      }
    });
    const notes = await CaregiverNote.query(this.knex).whereIn('socialSecNum', caregiverIds);
    notes.forEach(cf => {
      let caregiver = caregiverMap[`${cf.socialSecNum}`];
      if (caregiver) {
        caregiver.notes.push(cf);
      }
    });

    const reminders = await CaregiverReminder.query(this.knex).whereIn(
      'SocialSecurityNum',
      caregiverIds
    );
    reminders.forEach(cf => {
      let caregiver = caregiverMap[`${cf.SocialSecurityNum}`];
      if (caregiver) {
        caregiver.reminders.push(cf);
      }
    });
    return caregiverIds.filter(id => caregiverMap[id]).map(id => caregiverMap[id]);
  }

  static async updateLatLng(caregiver) {
    const addressHash = generateAddressHash(caregiver);
    if (addressHash !== caregiver.addressHash) {
      const address = `${caregiver.Address1}, ${caregiver.City}, ${caregiver.County},${
        caregiver.State
      } ${caregiver.Zip}, US`;
      try {
        const locationData = await GoogleMapService.getLocationFromAddress(address);
        if (
          locationData &&
          locationData.results &&
          locationData.results.length > 0 &&
          locationData.results[0].geometry
        ) {
          const location = locationData.results[0].geometry.location;
          caregiver.lat = lit(location.lat).castFloat();
          caregiver.lng = lit(location.lng).castFloat();
          caregiver.addressHash = addressHash;
          return;
        }
      } catch (err) {}
    }
    if (caregiver.lat) {
      caregiver.lat = lit(caregiver.lat).castFloat();
      caregiver.lng = lit(caregiver.lng).castFloat();
    }
  }

  static async addFormattedNumber(caregiverData) {
    if (caregiverData.Phone1) {
      const Phone1Formatted = MessageService.getPhoneNumber(caregiverData.Phone1);
      if (Phone1Formatted) {
        caregiverData.Phone1Formatted = Phone1Formatted;
      }
    }
  }

  async updateCaregiver(SocialSecurityNum, rawData, files) {
    const {imageDeleted, feedback} = rawData;
    const data = await caregiverUpdateSchema.validate(rawData, {stripUnknown: true});
    const response = {};

    CaregiverService.addFormattedNumber(data);
    await CaregiverService.updateLatLng(data);
    if (files && files.file && files.file.path) {
      let attachment = fs.readFileSync(files.file.path, 'binary');
      attachment = new Buffer(attachment, 'binary');
      const photo = await this.updateProfilePhoto(SocialSecurityNum, attachment);
      data.photo = photo;
    }
    const caregiver = await Caregiver.query(this.knex).updateAndFetchById(
      SocialSecurityNum,
      populateForUpdate(this.user, data)
    );

    response.personaldata = caregiver;

    return response;
  }

  async addCaregiver(rawData, files) {
    // const {imageDeleted, feedback} = rawData;
    const data = await caregiverAddSchema.validate(rawData, {stripUnknown: true});

    CaregiverService.addFormattedNumber(data);
    await CaregiverService.updateLatLng(data);
    if (files && files.file && files.file.path) {
      let attachment = fs.readFileSync(files.file.path, 'binary');
      attachment = new Buffer(attachment, 'binary');
      const photo = await this.updateProfilePhoto(data.SocialSecurityNum, attachment);
      data.photo = photo;
    }
    const caregiver = await Caregiver.query(this.knex)
      .returning('*')
      .insert(populateForCreate(this.user, data));

    return caregiver;
  }

  async updateProfilePhoto(SocialSecurityNum, bin_image) {
    const key = `caregiver_photos/${SocialSecurityNum.substr(
      0,
      2
    )}/${SocialSecurityNum}/${generateRandomIds()}.jpg`;
    const mimeContent = 'image/jpeg';
    await AWSService.uploadFileToS3FromContent(bin_image, key, mimeContent, ACL_PUBLIC_READ);
    return key;
    // await Caregiver.query(this.knex)
    //   .where({SocialSecurityNum: attachment.SocialSecurityNum})
    //   .update({photo: key});
  }

  async downloadAttachment(SocialSecurityNum, attachmentId) {
    const attachment = await CaregiverAttachment.query(this.knex).findById([
      SocialSecurityNum,
      parseInt(attachmentId)
    ]);
    if (!attachment) {
      throw new Error('Attachment not found');
    }
    if (attachment.documentPath) {
      // const url = await AWSService.generatePresignedUrlForDownload(attachment.documentPath);
      // attachment.downloadUrl = url;
      const file = await AWSService.downloadFile(attachment.documentPath);
      // delete attachment.attachment;
      attachment.attachment = file.Body;
    }
    return attachment;
  }

  async updateClassifications() {
    const newClassificationsList = [
      'CNA',
      'HHA',
      'RN',
      'LPN',
      'OT',
      'PT',
      'PTA',
      'ST',
      'OFFICE',
      'TERM',
      'MSW',
      'OTA',
      'APP' // This is for applicant;
    ];
    const classificationTransitions = [
      {current: 'TERM', new: 'TERM'},
      {current: 'RN', new: 'RN'},
      {current: 'PTA', new: 'PTA'},
      {current: 'LPN', new: 'LPN'},
      {current: 'PT', new: 'PT'},
      {current: 'MSW', new: 'MSW'},
      {current: 'ST', new: 'ST'},
      {current: 'OT', new: 'OT'},
      {current: 'OTA', new: 'OTA'},
      {current: 'OFFICE', new: 'OFFICE'},
      {current: 'RN-C', new: 'RN'},
      {current: 'RN-B', new: 'RN'},
      {current: 'RN-A', new: 'RN'},
      {current: 'CNA', new: 'CNA'},
      {current: 'HHA', new: 'HHA'},
      {current: 'MCHL', new: 'CNA-HHA', addLiveIn: true},
      {current: 'MCH', new: 'CNA-HHA'},
      {current: 'MALE', new: 'CNA-HHA'},
      {current: 'LIVE-IN', new: 'CNA-HHA', addLiveIn: true},
      {current: 'COMP3', new: 'CNA-HHA'},
      {current: 'COMP', new: 'CNA-HHA'},
      {current: 'CHL', new: 'CNA-HHA', addLiveIn: true},
      {current: 'CHA3', new: 'CNA-HHA'},
      {current: 'CHA', new: 'CNA-HHA'},
      {current: 'CH', new: 'CNA-HHA'},
      {current: '2LIVE-IN', new: 'CNA-HHA', addLiveIn: true},
      {current: '2COMP3', new: 'CNA-HHA'},
      {current: '2COMP', new: 'CNA-HHA'},
      {current: '2CHL3', new: 'CNA-HHA', addLiveIn: true},
      {current: '2CHL-C', new: 'CNA-HHA', addLiveIn: true},
      {current: '2CHL-B', new: 'CNA-HHA', addLiveIn: true},
      {current: '2CHL-A', new: 'CNA-HHA', addLiveIn: true},
      {current: '2CHA3', new: 'CNA-HHA'},
      {current: '2CHA-C', new: 'CNA-HHA'},
      {current: '2CHA-B', new: 'CNA-HHA'},
      {current: '2CHA-A', new: 'CNA-HHA'},
      {current: '1MALE', new: 'CNA-HHA'},
      {current: '1LIVE-IN', new: 'CNA-HHA', addLiveIn: true},
      {current: '1COMP3', new: 'CNA-HHA'},
      {current: '1COMP', new: 'CNA-HHA'},
      {current: '1CHA3', new: 'CNA-HHA'},
      {current: '1CHA', new: 'CNA-HHA'},
      {current: '0MALE', new: 'CNA-HHA'},
      {current: '0LIVE-IN', new: 'CNA-HHA', addLiveIn: true},
      {current: '0COMP3', new: 'CNA-HHA'},
      {current: '0COMP', new: 'CNA-HHA'},
      {current: '0CHA3', new: 'CNA-HHA'},
      {current: '0CHA', new: 'CNA-HHA'}
    ];
    const classificationsTransMap = classificationTransitions.reduce((obj, cur) => {
      obj[cur.current] = cur;
      return obj;
    }, {});
    const classificationsNotChange = classificationTransitions
      .filter(c => c.current === c.new)
      .map(c => c.current);

    const classifications = await Classification.query(this.knex);
    // .whereNotIn(
    //   'Description',
    //   classificationsNotChange
    // );
    const currentClassNames = classifications.map(c => c.Description);
    const classificationsToCreate = difference(newClassificationsList, currentClassNames);
    // console.log('classificationsToCreate', classificationsToCreate);
    for (let classification of classificationsToCreate) {
      const classObj = await Classification.query(this.knex).insert(
        populateForCreate(
          this.user,
          {
            Description: classification
          },
          Classification.creatorTimeFields
        )
      );
      classifications.push(classObj);
    }

    const classificationIdsNotToChange = classifications
      .filter(c => classificationsNotChange.includes(c.Description))
      .map(c => c.ClassificationID);
    const classificationIds = classifications.map(c => c.ClassificationID);
    const classificationIdTransMap = classifications.reduce((obj, c) => {
      obj[c.ClassificationID] = classificationsTransMap[c.Description];
      return obj;
    }, {});
    const classificationToIDMap = classifications.reduce((obj, c) => {
      obj[c.Description] = c.ClassificationID;
      return obj;
    }, {});

    let liveinAvailability = await Availability.query(this.knex).where('name', 'Live-in');
    let liveinCaregiverIds = [];
    if (liveinAvailability.length > 0) {
      liveinAvailability = liveinAvailability[0];
      const liveInCaregivers = await CaregiverAvailability.query(this.knex).where(
        'AvailabilityId',
        liveinAvailability.id
      );
      liveinCaregiverIds = liveInCaregivers.map(c => c.SocialSecurityNum);
    } else {
      liveinAvailability = await Availability.query(this.knex).insertAndFetch({
        name: 'Live-in',
        caregiver: true
      });
    }
    // const cnaReminder = await Reminder.query(this.knex).findOne({})
    const cnaLicenseReminders = await CaregiverReminder.query(this.knex)
      .where('description', 'CNA License')
      .where('ReminderOn', true)
      .select('SocialSecurityNum');
    const cnaLicensedCaregiverIds = cnaLicenseReminders.map(c => c.SocialSecurityNum);
    // console.log('cnaLicensedCaregiverIds', cnaLicensedCaregiverIds);
    const caregivers = await Caregiver.query(this.knex)
      .whereNotIn('ClassificationID', classificationIdsNotToChange)
      .select(['ClassificationID', 'SocialSecurityNum']);
    for (let i = 0; i < caregivers.length; i++) {
      const caregiver = caregivers[i];
      const transitionInfo = classificationIdTransMap[caregiver.ClassificationID];
      if (transitionInfo) {
        let newClassification = transitionInfo.current;
        if (transitionInfo.new === 'CNA-HHA') {
          newClassification = cnaLicensedCaregiverIds.includes(caregiver.SocialSecurityNum)
            ? 'CNA'
            : 'HHA';
        } else if (transitionInfo.new !== transitionInfo.current) {
          newClassification = transitionInfo.new;
        }
        const newClasificationId = classificationToIDMap[newClassification];
        if (newClasificationId !== caregiver.ClassificationID) {
          // console.log(
          //   'Updating classification for caregiver ',
          //   caregiver,
          //   transitionInfo.current,
          //   newClassification,
          //   newClasificationId
          // );
          await Caregiver.query(this.knex)
            .update({ClassificationID: newClasificationId})
            .where('SocialSecurityNum', caregiver.SocialSecurityNum);
        }

        if (transitionInfo.addLiveIn) {
          // Add Live-in Availability
          if (liveinAvailability) {
            if (!liveinCaregiverIds.includes(caregiver.SocialSecurityNum)) {
              await CaregiverAvailability.query(this.knex).insert({
                SocialSecurityNum: caregiver.SocialSecurityNum,
                AvailabilityId: liveinAvailability.id
              });
              // console.log('Adding live-in availabiilty for ', caregiver, transitionInfo);
            }
          }
        }
      } else {
        console.error('TransitionInfo Not Found for caregiver', caregiver);
      }
    }

    const applicantClassificationId = classificationToIDMap['APP'];
    if (applicantClassificationId) {
      await Applicant.query(this.knex)
        .whereNot('ClassificationID', applicantClassificationId)
        .update({ClassificationID: applicantClassificationId});
    }
    await Classification.query(this.knex)
      .whereNotIn('Description', newClassificationsList)
      .delete();
  }

  async getCaregiverWithCustomFields(query) {
    const caregiverQuery = Caregiver.query(this.knex);
    let socialSecNums;
    if (query.ClientId) {
      // This means, caregivers worked for certain client
      // const socialSecNumbers = await Schedule
      const schedules = await Schedule.query(this.knex)
        .where('ClientId', query.ClientId)
        .distinct('SocialSecNum');
      socialSecNums = schedules.map(s => s.SocialSecNum);
      caregiverQuery.whereIn('SocialSecurityNum', socialSecNums);
    }
    let caregivers = await caregiverQuery;
    const activeCustomFieldsForCaregiver = await CustomField.query(this.knex).where({
      showCaregiver: true
    });
    let cfieldsNames = activeCustomFieldsForCaregiver.map(field => field.cfieldName);
    const caregiverCustomFieldQuery = CaregiverCustomField.query(this.knex)
      .select('cfieldName', 'descr', 'SocialSecNum')
      .whereIn('cfieldName', cfieldsNames);
    if (socialSecNums) {
      caregiverCustomFieldQuery.whereIn('SocialSecNum', socialSecNums);
    }
    const caregiverFields = await caregiverCustomFieldQuery;

    const availabilities = await CaregiverAvailability.query(this.knex);
    let caregiverMap = caregivers.reduce((obj, cur) => {
      obj[`${cur.SocialSecurityNum}`] = cur;
      return obj;
    }, {});
    caregiverFields.forEach(cf => {
      let caregiver = caregiverMap[`${cf.SocialSecNum}`];
      if (caregiver) {
        caregiver[cf.cfieldName] = cf.descr;
      }
    });
    availabilities.forEach(av => {
      let caregiver = caregiverMap[`${av.SocialSecurityNum}`];
      if (caregiver) {
        caregiver[`AvailabilityIds`] = caregiver[`AvailabilityIds`]
          ? `${caregiver[`AvailabilityIds`]},${av.AvailabilityId}`
          : `${av.AvailabilityId}`;
      }
    });
    // if (query.showFirstLastVisit) {
    const scheduleQuery = Schedule.query(this.knex)
      .select(
        this.knex.raw(`Min(Date) as FirstVisitDate, Max(Date) as LastVisitDate, SocialSecNum`)
      )
      .groupBy('SocialSecNum');
    if (query.ClientId) {
      scheduleQuery.where('ClientId', query.ClientId);
    }
    const firstLastVisits = await scheduleQuery;
    firstLastVisits.forEach(vis => {
      let caregiver = caregiverMap[`${vis.SocialSecNum}`];
      if (caregiver) {
        caregiver.FirstVisitDate = vis.FirstVisitDate;
        caregiver.LastVisitDate = vis.LastVisitDate;
      }
    });
    // }
    return caregivers;
  }
}
