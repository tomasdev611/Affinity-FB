import moment from 'moment';
import {token} from '../../../services/passport';
import {difference, intersection, uniq} from 'lodash';
import {
  populateForUpdate,
  populateForCreate,
  sqlCompatibleDateString,
  fetchManyRecords,
  wrapAsync
} from '../../../lib/helpers';
import {MessageService} from '../../../models/MessageService';
import {CaregiverService} from '../../../models/CaregiverService';
import {CaregiverAttachmentService} from '../../../models/CaregiverAttachmentService';
const fs = require('fs');
const CaregiverModel = require('../../../models/caregiver');
// const CaregiverModel = require('../../../models/caregiver');
const CaregiverReminder = require('../../../models/CaregiverReminder');
// const CaregiverContact = require('../../../models/CaregiverContact');
const CaregiverAttachment = require('../../../models/CaregiverAttachment');
const CaregiverNote = require('../../../models/CaregiverNote');
const CustomField = require('../../../models/CustomField');
const Caregiver = require('../../../models/CaregiverModel');
const CaregiverCustomField = require('../../../models/CaregiverCustomField');
const CaregiverAvailability = require('../../../models/CaregiverAvailabilityModel');
const CaregiverLanguage = require('../../../models/CaregiverLanguageModel');
const CaregiverSkill = require('../../../models/CaregiverSkillModel');
// const MasterFormModel = require('../../../models/masterform');

module.exports = function(router) {
  router.get('/withcustomfields', token({required: true}), getCaregiverWithCustomFields);
  router.post('/search', token({required: true}), searchCaregivers);
  router.post('/search/data', token({required: true}), getDataForSearchPage);

  router.get('/inactive', token({required: true}), getInactiveCb);
  router.get('/active', token({required: true}), getActiveCb);
  router.get('/all', token({required: true}), getAllCb);

  router.get('/hours/caregiver', token({required: true}), readWithAssignedHours);
  router.post('/custom', token({required: true}), getCustomFields); //to avoid conflict

  router.get('/reminderDescription', token({required: true}), reminderDescription);

  router.post('/', token({required: true}), addCaregiver); //to avoid conflict
  router.get('/:SocialSecurityNum', token({required: true}), getByIdCb);
  router.get('/:SocialSecurityNum/all', token({required: true}), getAllInformationForCaregiver);
  router.put('/:SocialSecurityNum', token({required: true}), updateCaregiver);
  router.post('/:SocialSecurityNum/update_data', token({required: true}), updateCaregiver);
  router.post('/:SocialSecurityNum/photo', token({required: true}), uploadProfilePhoto);
  router.delete('/', token({required: true}), deleteCb);

  router.get('/contacts/:SocialSecurityNum', token({required: true}), getContactsById);
  router.post('/insertPhone/', token({required: true}), insertPhoneNumber);
  router.put('/address/:SocialSecurityNum', token({required: true}), putAddressCb);
  router.put('/updatePhone/:SocialSecurityNum', token({required: true}), updatePhone);

  router.get('/get/classificatioID', token({required: true}), getClaasificationID);
  router.get('/get/classtype', token({required: true}), getClassType);

  router.get('/reminder/all/all', token({required: true}), getAllReminders);

  router.get('/:SocialSecurityNum/reminders', token({required: true}), getReminderById);
  router.post('/:SocialSecurityNum/reminders', token({required: true}), insertReminder);
  router.put(
    '/:SocialSecurityNum/reminders/:ExpirationID',
    token({required: true}),
    updateReminder
  );
  router.delete(
    '/:SocialSecurityNum/reminders/:ExpirationID',
    token({required: true}),
    deleteReminder
  );

  router.post('/:SocialSecurityNum/attachments', token({required: true}), postAttachementById);
  router.get('/:SocialSecurityNum/attachments', token({required: true}), getAttachementById);
  router.put(
    '/:SocialSecurityNum/attachments/:attachmentId',
    token({required: true}),
    updateAttachementById
  );
  router.delete(
    '/:SocialSecurityNum/attachments/:attachmentId',
    token({required: true}),
    deleteAttachementById
  );
  router.get(
    '/:SocialSecurityNum/attachments/:attachmentId',
    token({required: true}),
    getSingleAttachment
  );
  router.get(
    '/:SocialSecurityNum/attachments/:attachmentId/download',
    token({required: true}),
    downloadAttachment
  );

  router.get('/:SocialSecurityNum/visits', token({required: true}), getVisitsByIdCb);

  router.get('/:SocialSecurityNum/notes', token({required: true}), getNotesForCaregiver);
  router.post('/:SocialSecurityNum/notes', token({required: true}), createNote);
  router.put('/:SocialSecurityNum/notes/:NoteDate/:NoteTime', token({required: true}), updateNote);
  router.delete(
    '/:SocialSecurityNum/notes/:NoteDate/:NoteTime',
    token({required: true}),
    deleteNote
  );

  router.get('/:SocialSecurityNum/customfields', token({required: true}), getCustomFields);
  router.post('/:SocialSecurityNum/customfields', token({required: true}), addUpdateCustomFields);
  router.post(
    '/:SocialSecurityNum/customfields/all',
    token({required: true}),
    addUpdateCustomFieldsAll
  );

  router.post('/:SocialSecurityNum/languages', token({required: true}), updateCaregiverLanguages);
  router.post(
    '/:SocialSecurityNum/availabilities',
    token({required: true}),
    updateCaregiverAvailabilities
  );
  router.post('/:SocialSecurityNum/skills', token({required: true}), updateCaregiverSkills);

  router.post('/compliance/reports', token({required: true}), getCaregiverComplianceReports);
};

/**
 * for fetch all Active caregiver
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCaregiverWithCustomFields(req, res, next) {
  try {
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    const caregivers = await caregiverService.getCaregiverWithCustomFields(req.query);
    // const model = new CaregiverModel();
    // let response = await model.readAllData(req.params, req.division_db, req.query.token);
    // const caregiverQuery = Caregiver.query(req.knex);
    // if (req.params.ClientId) {
    //   // This means, caregivers worked for certain client
    //   // const socialSecNumbers = await Schedule
    // } else {
    // }
    // let caregivers = await caregiverQuery;
    // const activeCustomFieldsForCaregiver = await CustomField.query(req.knex).where({
    //   showCaregiver: true
    // });
    // let cfieldsNames = activeCustomFieldsForCaregiver.map(field => field.cfieldName);
    // const caregiverFields = await CaregiverCustomField.query(req.knex)
    //   .select('cfieldName', 'descr', 'SocialSecNum')
    //   .whereIn('cfieldName', cfieldsNames);

    // const availabilities = await CaregiverAvailability.query(req.knex);
    // let caregiverMap = caregivers.reduce((obj, cur) => {
    //   obj[`${cur.SocialSecurityNum}`] = cur;
    //   return obj;
    // }, {});
    // caregiverFields.forEach(cf => {
    //   let caregiver = caregiverMap[`${cf.SocialSecNum}`];
    //   if (caregiver) {
    //     caregiver[cf.cfieldName] = cf.descr;
    //   }
    // });
    // availabilities.forEach(av => {
    //   let caregiver = caregiverMap[`${av.SocialSecurityNum}`];
    //   if (caregiver) {
    //     caregiver[`AvailabilityIds`] = caregiver[`AvailabilityIds`]
    //       ? `${caregiver[`AvailabilityIds`]},${av.AvailabilityId}`
    //       : `${av.AvailabilityId}`;
    //   }
    // });
    res.status(200).send(caregivers);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function searchCaregivers(req, res, next) {
  try {
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    const allCaregivers = await caregiverService.searchCaregivers(req.body);
    let caregivers = [];
    if (allCaregivers.length > 0) {
      caregivers = await caregiverService.getCaregiverDataForSearch(
        req.body.ClientId,
        allCaregivers.slice(0, req.body.pageSize || 10).map(c => c.SocialSecurityNum)
      );
    }
    res.status(200).send({allCaregivers, caregivers});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getDataForSearchPage(req, res, next) {
  try {
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    const {ids, ClientId} = req.body;
    const caregivers = await caregiverService.getCaregiverDataForSearch(ClientId, ids);
    res.status(200).send({caregivers});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function readWithAssignedHours(req, res, next) {
  const model = new CaregiverModel();
  model
    .readWithAssignedHours(req.division_db, req.query.token, req.query.calendarTime, req.query.type)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getByIdCb(req, res, next) {
  try {
    const caregiver = await Caregiver.query(req.knex).findById(req.params.SocialSecurityNum);
    res.status(200).send({...caregiver});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

async function getAllInformationForCaregiver(req, res) {
  try {
    const personaldata = await Caregiver.query(req.knex).findById(req.params.SocialSecurityNum);
    if (!personaldata) {
      throw new Error('Can not find caregiver');
    }
    const reminders = await CaregiverReminder.query(req.knex).where({
      SocialSecurityNum: req.params.SocialSecurityNum
    });
    const attachments = await CaregiverAttachment.query(req.knex)
      .where({
        socialSecNum: req.params.SocialSecurityNum
      })
      .select('socialSecNum', 'attachmentId', 'descr');
    const notes = await CaregiverNote.query(req.knex)
      .where({
        socialSecNum: req.params.SocialSecurityNum
      })
      .orderBy('NoteDate', 'desc');
    const customfields = await CaregiverCustomField.query(req.knex)
      .select('cfieldName', 'descr', 'SocialSecNum')
      .where('SocialSecNum', req.params.SocialSecurityNum);
    const availabilities = await CaregiverAvailability.query(req.knex).where({
      SocialSecurityNum: req.params.SocialSecurityNum
    });
    const languages = await CaregiverLanguage.query(req.knex).where({
      SocialSecurityNum: req.params.SocialSecurityNum
    });
    const skills = await CaregiverSkill.query(req.knex).where({
      SocialSecurityNum: req.params.SocialSecurityNum
    });
    res.status(200).send({
      personaldata,
      reminders,
      attachments,
      notes,
      customfields,
      availabilities,
      languages,
      skills
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

/**
 * to add a new caregiver in database
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addCaregiver(req, res, next) {
  try {
    // let caregiverData = {...req.body};
    // CaregiverService.addFormattedNumber(caregiverData);
    // await CaregiverService.updateLatLng(caregiverData);
    // const newCaregiver = await Caregiver.query(req.knex)
    //   .returning('*')
    //   .insert(populateForCreate(req.user, caregiverData));
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    const response = await caregiverService.addCaregiver(req.body, req.files);
    res.status(201).send(response);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateCaregiver(req, res, next) {
  try {
    // const {imageDeleted, feedback, ...data} = req.body;
    // const response = {};

    // CaregiverService.addFormattedNumber(data);
    // await CaregiverService.updateLatLng(data);
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    const response = await caregiverService.updateCaregiver(
      req.params.SocialSecurityNum,
      req.body,
      req.files
    );
    // const caregiver = await Caregiver.query(req.knex).updateAndFetchById(
    //   req.params.SocialSecurityNum,
    //   populateForUpdate(req.user, data)
    // );

    // response.personaldata = caregiver;
    // // if (imageDeleted) {
    // //   await model.deleteEmployeeImages(req.params.SocialSecurityNum, req.division_db);
    // //   response.imageData = [];
    // // }

    // if (req.files && req.files.file && req.files.file.path) {
    //   let attachment = fs.readFileSync(req.files.file.path, 'binary');
    //   attachment = new Buffer(attachment, 'binary');
    //   await caregiverService.updateProfilePhoto(req.params.SocialSecurityNum, attachment)
    // }

    res.status(200).send(response);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

// for insert new attachment
function uploadProfilePhoto(req, res, next) {
  const model = new CaregiverModel();
  let attachment = fs.readFileSync(req.files.file.path, 'binary');
  attachment = new Buffer(attachment, 'binary');

  // model.insertAttachment(req.body)
  model
    .uploadEmployeeImages(
      req.params.SocialSecurityNum,
      attachment,
      req.division_db,
      req.query.token
    )
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getCustomFields(req, res, next) {
  const model = new CaregiverModel();
  model
    .getCustomFields(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// for get all case manager for master form
function reminderDescription(req, res, next) {
  const model = new CaregiverModel();
  model
    .reminderDescription(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getContactsById(req, res, next) {
  const model = new CaregiverModel();
  model
    .contactsById(req.params.id, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getAllReminders(req, res, next) {
  const model = new CaregiverModel();
  model
    .getAllReminders(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function putAddressCb(req, res, next) {
  const model = new CaregiverModel();
  model
    .updateAddress(req.params.id, req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function insertPhoneNumber(req, res, next) {
  const model = new CaregiverModel();

  model
    .insertPhone(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function deleteCb(req, res, next) {
  const model = new CaregiverModel();
  model
    .delete(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function updatePhone(req, res, next) {
  const model = new CaregiverModel();

  model
    .updatePhone(req.body, req.params.SocialSecurityNum, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// get classification id from  classification table
function getClaasificationID(req, res, next) {
  const model = new CaregiverModel();
  model
    .getClaasificationID(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
// get classification id from  classification table
function getClassType(req, res, next) {
  const model = new CaregiverModel();
  model
    .getClassType(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getReminderById(req, res, next) {
  try {
    const reminders = await CaregiverReminder.query(req.knex).where({
      SocialSecurityNum: req.params.SocialSecurityNum
    });
    res.status(200).send(reminders);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function insertReminder(req, res, next) {
  try {
    const reminder = await CaregiverReminder.query(req.knex).insert({
      SocialSecurityNum: req.params.SocialSecurityNum,
      ...populateForCreate(req.user, req.body)
    });
    res.status(200).send(reminder);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateReminder(req, res, next) {
  try {
    const reminder = await CaregiverReminder.query(req.knex).updateAndFetchById(
      [req.params.SocialSecurityNum, req.params.ExpirationID],
      populateForUpdate(req.user, req.body)
    );
    res.status(200).send(reminder);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteReminder(req, res, next) {
  try {
    const success = await CaregiverReminder.query(req.knex).deleteById([
      req.params.SocialSecurityNum,
      parseInt(req.params.ExpirationID)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        SocialSecurityNum: req.params.SocialSecurityNum,
        ExpirationID: req.params.ExpirationID
      });
    } else {
      res.status(500).send({success: false});
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

/**
 * APIs for Notes
 */
async function getNotesForCaregiver(req, res, next) {
  try {
    const notes = await CaregiverNote.query(req.knex)
      .where({
        socialSecNum: req.params.SocialSecurityNum
      })
      .orderBy('NoteDate', 'desc');
    res.status(200).send(notes);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function createNote(req, res, next) {
  try {
    let NoteDate = new Date()
      .toLocaleString('en-US', {hour12: false, timeZone: 'America/New_York'})
      .slice(0, 20)
      .replace(',', '');
    let NoteTime = new Date()
      .toLocaleString('en-US', {hour12: false, timeZone: 'America/New_York'})
      .slice(0, 20)
      .replace(',', '');

    const note = await CaregiverNote.query(req.knex).insert({
      socialSecNum: req.params.SocialSecurityNum,
      ...populateForCreate(req.user, req.body),
      NoteDate,
      NoteTime
    });
    res.status(200).send(note);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const {NoteDateTime, Description, noteTypeID} = req.body;
    const updatData = {Description, noteTypeID};
    if (NoteDateTime) {
      const newDate = new Date(NoteDateTime);
      let NoteDate = newDate
        .toLocaleString('en-US', {hour12: false, timeZone: 'America/New_York'})
        .slice(0, 20)
        .replace(',', '');
      let NoteTime = newDate
        .toLocaleString('en-US', {hour12: false, timeZone: 'America/New_York'})
        .slice(0, 20)
        .replace(',', '');
      updatData.NoteDate = NoteDate;
      updatData.NoteTime = NoteTime;
    }
    await CaregiverNote.query(req.knex).updateAndFetchById(
      [req.params.SocialSecurityNum, new Date(req.params.NoteDate), new Date(req.params.NoteTime)],
      populateForUpdate(req.user, updatData)
    );
    const note = await CaregiverNote.query(req.knex).findById([
      req.params.SocialSecurityNum,
      updatData.NoteDate || req.params.NoteDate,
      updatData.NoteTime || req.params.NoteTime
    ]);
    if (!note) {
      throw new Error('Failed to update');
    }
    res.status(200).send(note);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    const success = await CaregiverNote.query(req.knex).deleteById([
      req.params.SocialSecurityNum,
      new Date(req.params.NoteDate),
      new Date(req.params.NoteTime)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        SocialSecurityNum: req.params.SocialSecurityNum,
        NoteDate: req.params.NoteDate,
        NoteTime: req.params.NoteTime
      });
    } else {
      res.status(500).send({success: false});
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCustomFields(req, res, next) {
  try {
    const activeCustomFieldsForCaregiver = await CustomField.query(req.knex).where({
      showCaregiver: true
    });
    let cfieldsNames = activeCustomFieldsForCaregiver.map(field => field.cfieldName);
    const customfields = await CaregiverCustomField.query(req.knex)
      .where({
        SocialSecNum: req.params.SocialSecurityNum
      })
      .whereIn('cfieldName', cfieldsNames);
    res.status(200).send(customfields);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addUpdateCustomFields(req, res, next) {
  try {
    const existingField = await CustomField.query(req.knex).findOne({
      showCaregiver: true,
      cfieldName: req.body.cfieldName
    });
    if (!existingField) {
      throw new Error('Custom field does not exist');
    }
    let caregiverField = await CaregiverCustomField.query(req.knex).findById([
      req.params.SocialSecurityNum,
      req.body.cfieldName
    ]);

    if (caregiverField) {
      caregiverField = await CaregiverCustomField.query(req.knex).updateAndFetchById(
        [req.params.SocialSecurityNum, req.body.cfieldName],
        populateForUpdate(req.user, {descr: req.body.descr})
      );
    } else {
      caregiverField = await CaregiverCustomField.query(req.knex).insert({
        SocialSecNum: req.params.SocialSecurityNum,
        ...populateForCreate(req.user, req.body)
      });
    }
    res.status(200).send(caregiverField);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function addUpdateCustomFieldsAll(req, res, next) {
  try {
    let fields = req.body.customfields;
    // const existingField = await CustomField.query(req.knex).findOne({
    //   showCaregiver: true,
    //   cfieldName: req.body.cfieldName
    // });
    // if (!existingField) {
    //   throw new Error('Custom field does not exist');
    // }
    const fieldsWithData = fields.filter(f => f.descr).map(f => f.cfieldName);
    let currentFields = await CaregiverCustomField.query(req.knex).where(
      'SocialSecNum',
      req.params.SocialSecurityNum
    );
    const currentFieldNames = currentFields.map(f => f.cfieldName);
    const currentFieldsMap = currentFields.reduce((obj, cur) => {
      obj[cur.cfieldName] = cur;
      return obj;
    }, {});
    const toDelete = difference(currentFieldNames, fieldsWithData);

    if (toDelete.length > 0) {
      await CaregiverCustomField.query(req.knex)
        .where('SocialSecNum', req.params.SocialSecurityNum)
        .whereIn('cfieldName', toDelete)
        .delete();
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.descr) {
        if (currentFieldsMap[field.cfieldName]) {
          if (currentFieldsMap[field.cfieldName].descr !== field.descr) {
            await CaregiverCustomField.query(req.knex).updateAndFetchById(
              [req.params.SocialSecurityNum, field.cfieldName],
              populateForUpdate(req.user, {descr: field.descr})
            );
          }
        } else {
          await CaregiverCustomField.query(req.knex).insert({
            SocialSecNum: req.params.SocialSecurityNum,
            ...populateForCreate(req.user, field)
          });
        }
      }
    }

    const customfields = await CaregiverCustomField.query(req.knex).where(
      'SocialSecNum',
      req.params.SocialSecurityNum
    );

    res.status(200).send({customfields});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateCaregiverLanguages(req, res, next) {
  try {
    const languageIds = req.body.languages.map(l => l.id);
    await CaregiverLanguage.query(req.knex)
      .where('SocialSecurityNum', req.params.SocialSecurityNum)
      .whereNotIn('LanguageId', languageIds)
      .delete();

    let existingLanguages = await CaregiverLanguage.query(req.knex).where(
      'SocialSecurityNum',
      req.params.SocialSecurityNum
    );
    let currentIds = existingLanguages.map(l => l.LanguageId);
    let needsToAdd = difference(languageIds, currentIds);
    for (let i = 0; i < needsToAdd.length; i++) {
      await CaregiverLanguage.query(req.knex).insert({
        SocialSecurityNum: req.params.SocialSecurityNum,
        LanguageId: needsToAdd[i]
      });
    }

    let languages = languageIds.map(l => ({
      SocialSecurityNum: req.params.SocialSecurityNum,
      LanguageId: l
    }));
    res.status(200).send({languages});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateCaregiverAvailabilities(req, res, next) {
  try {
    const availabilityIds = req.body.availabilities.map(l => l.id);
    await CaregiverAvailability.query(req.knex)
      .where('SocialSecurityNum', req.params.SocialSecurityNum)
      .whereNotIn('AvailabilityId', availabilityIds)
      .delete();

    let existingAvailabilities = await CaregiverAvailability.query(req.knex).where(
      'SocialSecurityNum',
      req.params.SocialSecurityNum
    );
    let currentIds = existingAvailabilities.map(l => l.AvailabilityId);
    let needsToAdd = difference(availabilityIds, currentIds);
    for (let i = 0; i < needsToAdd.length; i++) {
      await CaregiverAvailability.query(req.knex).insert({
        SocialSecurityNum: req.params.SocialSecurityNum,
        AvailabilityId: needsToAdd[i]
      });
    }

    let availabilities = availabilityIds.map(l => ({
      SocialSecurityNum: req.params.SocialSecurityNum,
      AvailabilityId: l
    }));
    res.status(200).send({availabilities});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateCaregiverSkills(req, res, next) {
  try {
    const skillIds = req.body.skills.map(l => l.SkillId);
    await CaregiverSkill.query(req.knex)
      .where('SocialSecurityNum', req.params.SocialSecurityNum)
      .whereNotIn('SkillId', skillIds)
      .delete();

    let existingSkills = await CaregiverSkill.query(req.knex).where(
      'SocialSecurityNum',
      req.params.SocialSecurityNum
    );
    let currentIds = existingSkills.map(l => l.SkillId);
    let needsToAdd = difference(skillIds, currentIds);
    for (let i = 0; i < needsToAdd.length; i++) {
      await CaregiverSkill.query(req.knex).insert({
        SocialSecurityNum: req.params.SocialSecurityNum,
        SkillId: needsToAdd[i]
      });
    }

    let skills = skillIds.map(l => ({
      SocialSecurityNum: req.params.SocialSecurityNum,
      SkillId: l
    }));
    res.status(200).send({skills});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
async function getAttachementById(req, res, next) {
  try {
    const attachments = await CaregiverAttachment.query(req.knex).where({
      socialSecNum: req.params.SocialSecurityNum
    });
    res.status(200).send(attachments);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function postAttachementById(req, res, next) {
  try {
    let attachment = fs.readFileSync(req.files.file.path, 'binary');
    var binBuff = new Buffer(attachment, 'binary');
    const documentPath = await CaregiverAttachmentService.uploadAttachmentForUser(
      {
        socialSecNum: req.params.SocialSecurityNum,
        ...req.body
      },
      binBuff
    );
    const reminder = await CaregiverAttachment.query(req.knex).insert({
      socialSecNum: req.params.SocialSecurityNum,
      ...req.body,
      // attachment: binBuff,
      documentPath
    });
    res.status(200).send(reminder);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateAttachementById(req, res, next) {
  try {
    let updateDoc = {...req.body};
    const attachmentDoc = await CaregiverAttachment.query(req.knex).findById([
      req.params.SocialSecurityNum,
      parseInt(req.params.attachmentId)
    ]);
    if (!attachmentDoc) {
      throw new Error('Not found');
    }
    if (req.files && req.files.file && req.files.file.path) {
      let attachment = fs.readFileSync(req.files.file.path, 'binary');
      let binBuff = new Buffer(attachment, 'binary');
      // updateDoc.attachment = binBuff;
      const documentPath = await CaregiverAttachmentService.uploadAttachmentForUser(
        attachmentDoc,
        binBuff
      );
      updateDoc.documentPath = documentPath;
    }
    const result = await CaregiverAttachment.query(req.knex).updateAndFetchById(
      [req.params.SocialSecurityNum, req.params.attachmentId],
      updateDoc
    );
    res.status(200).send(result);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteAttachementById(req, res, next) {
  try {
    const success = await CaregiverAttachment.query(req.knex).deleteById([
      req.params.SocialSecurityNum,
      parseInt(req.params.attachmentId)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        SocialSecurityNum: req.params.SocialSecurityNum,
        attachmentId: req.params.attachmentId
      });
    } else {
      res.status(500).send({success: false});
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getSingleAttachment(req, res, next) {
  try {
    const attachment = await CaregiverAttachment.query(req.knex).findById([
      req.params.SocialSecurityNum,
      parseInt(req.params.attachmentId)
    ]);
    if (!attachment) {
      throw new Error('Attachment not found');
    }
    res.status(200).send({
      success: true,
      attachment
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function downloadAttachment(req, res, next) {
  try {
    const caregiverService = new CaregiverService(req.knex, req.user, req.division_db);
    const attachment = await caregiverService.downloadAttachment(
      req.params.SocialSecurityNum,
      req.params.attachmentId
    );
    res.status(200).send({
      success: true,
      attachment
    });
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getVisitsByIdCb(req, res, next) {
  try {
    const model = new CaregiverModel();
    const result = await model.getVisitHistory(
      req.params.SocialSecurityNum,
      req.division_db,
      req.query.token
    );

    res.status(200).send(result);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

/**
 * for fetch all  Inactive caregiver
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getInactiveCb(req, res, next) {
  const model = new CaregiverModel();
  model
    .readInactiveData(req.params, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
/**
 * for fetch all Active caregiver
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getAllCb(req, res, next) {
  const model = new CaregiverModel();
  model
    .readAllData(req.params, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 * for fetch all Active caregiver
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getActiveCb(req, res, next) {
  const model = new CaregiverModel();
  model
    .readActiveData(req.params, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function postCb(req, res, next) {
  const model = new CaregiverModel();
  model
    .create(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

async function getCaregiverComplianceReports(req, res, next) {
  try {
    let expirationDate = req.body.expirationDate;
    let descriptions = req.body.reminderTypes;
    // let fields = req.body.fields;
    let status = req.body.status;
    let reminderMode = req.body.reminderMode;
    const reminderQuery = CaregiverReminder.query(req.knex)
      .whereIn('description', descriptions)
      .where('expirationDate', '<=', `${expirationDate} 00:00:00.000`)
      .select('SocialSecurityNum', 'description', 'expirationDate');
    if (reminderMode) {
      if (reminderMode === 'A') {
        reminderQuery.where('ReminderOn', true);
      } else {
        reminderQuery.where('ReminderOn', false);
      }
    }
    const reminders = await reminderQuery;
    const caregiverIds = uniq(reminders.map(r => r.SocialSecurityNum));
    let caregiversQuery = Caregiver.query(req.knex); // .whereIn('SocialSecurityNum', caregiverIds);
    // TODO. Too many caregiver ids, and sql server throws error
    // Find a way. Maybe split the query into multiple query
    if (status) {
      caregiversQuery = caregiversQuery.where('Status', status);
    }
    let caregivers = await fetchManyRecords(caregiversQuery, 'SocialSecurityNum', caregiverIds);
    if (caregivers.length > 0) {
      let finalCaregiverIds = caregivers.map(c => c.SocialSecurityNum);

      let caregiverMap = caregivers.reduce((obj, cur) => {
        obj[`${cur.SocialSecurityNum}`] = cur;
        return obj;
      }, {});

      const activeCustomFieldsForCaregiver = await CustomField.query(req.knex).where(
        'showCaregiver',
        true
      );
      // .whereIn('cfieldName', fields);
      if (activeCustomFieldsForCaregiver && activeCustomFieldsForCaregiver.length > 0) {
        let cfieldsNames = activeCustomFieldsForCaregiver.map(field => field.cfieldName);
        const caregiverFieldsQuery = CaregiverCustomField.query(req.knex)
          .select('cfieldName', 'descr', 'SocialSecNum')
          .whereIn('cfieldName', cfieldsNames);

        let caregiverFields = await fetchManyRecords(
          caregiverFieldsQuery,
          'SocialSecNum',
          finalCaregiverIds
        );

        caregiverFields.forEach(cf => {
          let caregiver = caregiverMap[`${cf.SocialSecNum}`];
          if (caregiver) {
            caregiver[cf.cfieldName] = cf.descr;
          }
        });
      }
      reminders.forEach(cf => {
        let caregiver = caregiverMap[`${cf.SocialSecurityNum}`];
        if (caregiver) {
          try {
            caregiver[cf.description] = moment(cf.expirationDate).format('YYYY-MM-DD');
          } catch (err) {}
        }
      });
    }
    res.status(201).send(caregivers);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
