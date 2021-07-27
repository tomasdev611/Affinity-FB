// code done by Jatin Feb 24

import {CaregiverAttachmentService} from '../../../models/CaregiverAttachmentService';
import {ClientAttachmentService} from '../../../models/ClientAttachmentService';
import {lit} from 'objection';
import createError from 'http-errors';
import {token} from '../../../services/passport';
import {GoogleMapService} from '../../../services/googlemap';
import {
  populateForUpdate,
  populateForCreate,
  generateAddressHash,
  canUserDoAction
} from '../../../lib/helpers';
import {MessageService} from '../../../models/MessageService';
import PhoneNumberModel from '../../../models/PhoneNumberModel';
import SecurityUser from '../../../models/SecurityUser';
import {CaregiverService} from '../../../models/CaregiverService';
import {ClientService} from '../../../models/ClientService';

import {ApplicantAttachmentService} from '../../../models/ApplicantAttachmentService';
import {CaregiverImageService} from '../../../models/CaregiverImageService';
import {ApplicantImageService} from '../../../models/ApplicantImageService';

const MasterFormModel = require('../../../models/masterform');
const ClientModel = require('../../../models/client');
const SecurityGroup = require('../../../models/SecurityGroupModel');

const Reason = require('../../../models/ReasonModel');
const ClientNoteType = require('../../../models/ClientNoteTypeModel');
const CaregiverNoteType = require('../../../models/CaregiverNoteTypeModel');
const InitialContact = require('../../../models/ClientInitialContact');
const CaseManager = require('../../../models/CaseManagerModel');
const Relation = require('../../../models/RelationModel');
const Reminder = require('../../../models/ReminderModel');
const Location = require('../../../models/LocationModel');
const Referredby = require('../../../models/ReferredbyModel');
const Payor = require('../../../models/PayorModel');
const Physician = require('../../../models/PhysicianModel');
const ClientType = require('../../../models/ClientTypeModel');
const County = require('../../../models/CountyModel');
const Service = require('../../../models/ServiceModel');
const ClassModel = require('../../../models/ClassModel');
const Classification = require('../../../models/ClassificationModel');
// const Classification = require('../../../models/ClassificationModel');
const Skill = require('../../../models/SkillModel');
const Availability = require('../../../models/AvailabilityModel');
const Language = require('../../../models/LanguageModel');
const MessageTemplate = require('../../../models/MessageTemplateModel');
const Caregiver = require('../../../models/CaregiverModel');
const Client = require('../../../models/ClientModel');
const CustomField = require('../../../models/CustomField');

const targetModelMap = {
  clientNoteTypes: ClientNoteType,
  caregiverNoteTypes: CaregiverNoteType,
  reasons: Reason,
  initialContacts: InitialContact,
  caseManagers: CaseManager,
  relations: Relation,
  reminderDescriptions: Reminder,
  locationData: Location,
  referredBy: Referredby,
  payors: Payor,
  physicians: Physician,
  clientTypes: ClientType,
  counties: County,
  services: Service,
  classesNames: ClassModel,
  classifications: Classification,
  customfields: CustomField,
  securityGroups: SecurityGroup,
  skills: Skill,
  availabilities: Availability,
  languages: Language,
  templates: MessageTemplate,
  phoneNumbers: PhoneNumberModel,
  securityUsers: SecurityUser
};

module.exports = function(router) {
  // Taking care of master form data
  router.get('/all', token({required: true}), getAllConfig);
  router.post('/data', token({required: true}), createData);
  router.put('/data', token({required: true}), updateData);
  // This is special case as we want to send some data to delete method
  // As sending body in delete is not encouraged, implemented it as a post.
  router.post('/data/delete', token({required: true}), deleteData);

  // Synching phone number
  router.post('/sync_caregiver_phone', token({required: true}), updateCaregiverFormattedNumber);

  // Below are helper APIs called from postman, not from front-end.
  router.post(
    '/update_message_socialsecuritynum',
    token({required: true}),
    updateMessageSocialSecurityNum
  );
  router.post('/update_message_roomid', token({required: true}), updateMessageRoomId);
  router.post('/add_lat_lng', token({required: true}), addLatLngToCaregiverClient);
  router.post('/add_lat_lng/client', token({required: true}), addLatLngToClient);

  router.post('/sync-files-s3', token({required: true}), syncFilesToS3);
  router.post('/sync-applicant-files-s3', token({required: true}), syncApplicantFilesToS3);

  router.post('/sync-caregiver-photos-s3', token({required: true}), syncCaregiverPhotosToS3);

  // router.post('/download-files-s3', token({required: true}), downloadFilesFromS3);

  router.post(
    '/remove-all-attachments-database',
    token({required: true}),
    removeAttachmentFromDatabase
  );

  router.post('/sync-attachment-path', token({required: true}), syncAttachmentPathWithoutUpload);

  router.post(
    '/update-caregiver-classifications',
    token({required: true}),
    updateCaregiverClassifications
  );

  router.post(
    '/fix-client-note-datetime',
    token({required: true}),
    fixClientNoteDateTime
  );
};

async function syncFilesToS3(req, res) {
  try {
    const caregiverAttachmentService = new CaregiverAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    caregiverAttachmentService.syncAttachmentsToS3();

    const clientAttachmentService = new ClientAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    clientAttachmentService.syncAttachmentsToS3();

    res.status(200).send({
      message: 'Request Accepted'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function syncApplicantFilesToS3(req, res) {
  try {
    const applicantAttachmentService = new ApplicantAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    applicantAttachmentService.syncAttachmentsToS3();

    res.status(200).send({
      message: 'Request Accepted'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function syncCaregiverPhotosToS3(req, res) {
  try {
    const caregiverImageService = new CaregiverImageService(req.knex, req.user, req.division_db);
    caregiverImageService.syncAttachmentsToS3();
    const applicantImageService = new ApplicantImageService(req.knex, req.user, req.division_db);
    applicantImageService.syncAttachmentsToS3();

    res.status(200).send({
      message: 'Request Accepted'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function downloadFilesFromS3(req, res) {
  try {
    const caregiverAttachmentService = new CaregiverAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    caregiverAttachmentService.downloadAllAttachments();

    const clientAttachmentService = new ClientAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    clientAttachmentService.downloadAllAttachments();

    res.status(200).send({
      message: 'Request Accepted'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function syncAttachmentPathWithoutUpload(req, res) {
  try {
    const caregiverAttachmentService = new CaregiverAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    await caregiverAttachmentService.updateAttachmentPathsToS3WithoutUpload();

    const clientAttachmentService = new ClientAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    await clientAttachmentService.updateAttachmentPathsToS3WithoutUpload();

    res.status(200).send({
      message: 'Complete'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function removeAttachmentFromDatabase(req, res) {
  try {
    const caregiverAttachmentService = new CaregiverAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    await caregiverAttachmentService.removeFilesForAllCaregivers();

    const clientAttachmentService = new ClientAttachmentService(
      req.knex,
      req.user,
      req.division_db
    );
    await clientAttachmentService.removeFilesForAllClients();
    res.status(200).send({
      message: 'Complete',
      socialSecurityNums
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getAllConfig(req, res, next) {
  try {
    // TODO: DEVELOP SECURITY PRACTICE ON THE API.
    // SHOULD CHECK SECURITY USER GROUP AND RETURN DATA ACCORDING TO THAT INFORMATION
    const model = new MasterFormModel();
    const clientModel = new ClientModel();
    // const customFieldModel = new CustomFieldModel();
    // const modelClientNode = new ClientNotesModel();
    // const masterFormModel = new MasterFormModel();
    const response = {};

    let reasons = await model.getReason(req.division_db, req.query.token);
    let locationData = await model.getLocation(req.division_db, req.query.token);
    let physicians = await model.getPhysician(req.division_db, req.query.token);
    let clientTypes = await model.getClientType(req.division_db, req.query.token);
    let clientNoteTypes = await model.getClientNoteType(req.division_db, req.query.token);
    let caregiverNoteTypes = await model.getCaregiverNoteType(req.division_db, req.query.token);
    let services = await model.getServices(req.division_db, req.query.token);

    let customfields = await CustomField.query(req.knex)
      .select(...CustomField.columnsForFetch)
      .where('status', 1)
      .orderBy('created', 'desc');
    let classesNames = await model.getClassesName(req.division_db, req.query.token);
    let classifications = await model.getClassification(req.division_db, req.query.token);
    let counties = await model.getCounty(req.division_db, req.query.token);
    let caseManagers = await model.getCaseManager(req.division_db, req.query.token);
    let reminderDescriptions = await model.getAllReminders(req.division_db, req.query.token);
    let initialContacts = await clientModel.getInitialContact(req.division_db, req.query.token);
    let relations = await clientModel.getRelations(req.division_db, req.query.token);
    let referredBy = await clientModel.getReferredBy(req.division_db, req.query.token);
    let payors = await clientModel.getPayor(req.division_db, req.query.token);
    let securityGroups = await SecurityGroup.query(req.knex);
    let skills = await Skill.query(req.knex).select(...Skill.columnsForFetch);
    let availabilities = await Availability.query(req.knex).select(...Availability.columnsForFetch);
    let languages = await Language.query(req.knex).select(...Language.columnsForFetch);
    let templates = await MessageTemplate.query(req.knex).select(
      ...MessageTemplate.columnsForFetch
    );

    let clients = await Client.query(req.knex)
      .where('Status', 'A')
      .select('ClientId', 'FirstName', 'LastName', 'Status')
      .orderBy(['FirstName', 'LastName']);
    let caregivers = await Caregiver.query(req.knex)
      .where('Status', 'A')
      .select('SocialSecurityNum', 'FirstName', 'LastName', 'Status')
      .orderBy(['FirstName', 'LastName']);

    Object.assign(response, {
      clientNoteTypes,
      caregiverNoteTypes,
      reasons,
      initialContacts,
      caseManagers,
      relations,
      reminderDescriptions,
      locationData,
      referredBy,
      payors,
      physicians,
      clientTypes,
      counties,
      services,
      classesNames,
      classifications,
      customfields,
      securityGroups,
      skills,
      availabilities,
      languages,
      templates,
      clients,
      caregivers
    });
    if (canUserDoAction(req.user, 'Administrator', 'read')) {
      let phoneNumbers = await PhoneNumberModel.query(req.knex).select();
      let securityUsers = await SecurityUser.query(req.knex).select(
        ...SecurityUser.columnsForFetch
      );
      Object.assign(response, {
        phoneNumbers,
        securityUsers
      });
    }

    res.status(201).send(response);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function createData(req, res) {
  try {
    const {target, data} = req.body;
    const CommonModel = targetModelMap[target];
    if (!CommonModel) {
      throw new Error('Target not available');
    }
    if (target === 'securityUsers') {
      throw createError(400, 'Invalid request');
    }
    if (target === 'phoneNumbers') {
      const Phone1Formatted = MessageService.getPhoneNumber(data.PhoneNumber);
      if (!Phone1Formatted) {
        throw createError(400, 'Invalid phone number');
      }
      data.PhoneNumber = Phone1Formatted;
    }
    const newData = await CommonModel.query(req.knex)
      .returning('*')
      .insert(populateForCreate(req.user, data, CommonModel.creatorTimeFields));
    res.status(201).send({
      target,
      data: newData
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateData(req, res) {
  try {
    const {target, data, idInfo} = req.body;
    const CommonModel = targetModelMap[target];
    if (!CommonModel) {
      throw new Error('Target not available');
    }
    let newData = await CommonModel.query(req.knex).patchAndFetchById(
      idInfo,
      populateForUpdate(req.user, data, CommonModel.creatorTimeFields)
    ); // updateAndFetchById
    if (!newData) {
      let newIdInfo = idInfo;
      if (Array.isArray(CommonModel.idColumn)) {
        newIdInfo = CommonModel.idColumn.map(m => data[m]);
      } else {
        newIdInfo = data[CommonModel.idColumn];
      }
      newData = await CommonModel.query(req.knex).findById(newIdInfo);
    }
    if (CommonModel.columnsForFetch) {
      newData = Object.keys(newData).reduce((obj, cur) => {
        if (CommonModel.columnsForFetch.includes(cur)) {
          obj[cur] = newData[cur];
        }
        return obj;
      }, {});
    }
    res.status(201).send({
      target,
      idInfo,
      data: newData
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteData(req, res) {
  try {
    const {target, idInfo} = req.body;
    const CommonModel = targetModelMap[target];
    if (!CommonModel) {
      throw new Error('Target not available');
    }
    await CommonModel.query(req.knex).deleteById(idInfo);
    res.status(201).send({
      target,
      idInfo
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateCaregiverFormattedNumber(req, res) {
  try {
    let caregivers = await Caregiver.query(req.knex)
      .whereNotNull('Phone1')
      .select('Phone1', 'Phone1Formatted', 'SocialSecurityNum');
    for (let i = 0; i < caregivers.length; i++) {
      const caregiver = caregivers[i];
      if (caregiver.Phone1) {
        try {
          const Phone1Formatted = MessageService.getPhoneNumber(caregiver.Phone1);
          if (Phone1Formatted) {
            if (caregiver.Phone1Formatted !== Phone1Formatted) {
              await Caregiver.query(req.knex)
                .where('SocialSecurityNum', caregiver.SocialSecurityNum)
                .update({
                  Phone1Formatted: Phone1Formatted
                });
            }
          }
        } catch (error) {
          console.error('updateCaregiverFormattedNumber', error);
        }
      }
    }
    res.status(200).send({
      message: 'Complete'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateMessageSocialSecurityNum(req, res) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    await messageService.updateMessageSocialSecurityNum();
    res.status(200).send({
      message: 'Complete'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateMessageRoomId(req, res) {
  try {
    const messageService = new MessageService(req.knex, req.user, req.division_db);
    await messageService.updateMessageRoomId();
    res.status(200).send({
      message: 'Complete'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function addLatLngToCaregiverClient(req, res) {
  try {
    let caregivers = await Caregiver.query(req.knex)
      // .whereNull('lat')
      .select('Address1', 'SocialSecurityNum', 'City', 'County', 'State', 'Zip', 'addressHash');
    for (let i = 0; i < caregivers.length; i++) {
      const caregiver = caregivers[i];
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
            await Caregiver.query(req.knex)
              .where('SocialSecurityNum', caregiver.SocialSecurityNum)
              .update({
                lng: lit(location.lng).castFloat(),
                lat: lit(location.lat).castFloat(),
                addressHash
              });
          }
        } catch (error) {
          console.error('addLatLngToCaregiverClient', error);
        }
      }
    }
    res.status(200).send({
      message: 'Complete'
    });
  } catch (error) {
    // console.error('Error', error);
    res.status(500).send(error);
  }
}

async function addLatLngToClient(req, res) {
  try {
    let clients = await Client.query(req.knex)
      // .whereNull('lat')
      .select('Address1', 'ClientId', 'City', 'County', 'State', 'Zip', 'addressHash');
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const addressHash = generateAddressHash(client);
      if (addressHash !== client.addressHash) {
        const address = `${client.Address1}, ${client.City}, ${client.County},${client.State} ${
          client.Zip
        }, US`;
        try {
          const locationData = await GoogleMapService.getLocationFromAddress(address);
          if (
            locationData &&
            locationData.results &&
            locationData.results.length > 0 &&
            locationData.results[0].geometry
          ) {
            const location = locationData.results[0].geometry.location;
            await Client.query(req.knex)
              .where('ClientId', client.ClientId)
              .update({
                lng: lit(location.lng).castFloat(),
                lat: lit(location.lat).castFloat(),
                addressHash
              });
          }
        } catch (error) {
          console.error('addLatLngToClient', error);
        }
      }
    }
    res.status(200).send({
      message: 'Complete'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateCaregiverClassifications(req, res) {
  try {
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    caregiverService.updateClassifications();
    res.status(200).send({
      message: 'Request Accepted'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function fixClientNoteDateTime(req, res) {
  try {
    const clientService = new ClientService(req.knex, req.user, req.division_db);
    clientService.updateNotesTime();
    res.status(200).send({
      message: 'Request Accepted'
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
