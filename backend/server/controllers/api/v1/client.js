// import {omit} from 'lodash';
import {difference, intersection, omit, uniq} from 'lodash';
import moment from 'moment';
import {token} from '../../../services/passport';
import {
  populateForUpdate,
  populateForCreate,
  sqlCompatibleDateString,
  fetchManyRecords
} from '../../../lib/helpers';
import {ClientService} from '../../../models/ClientService';
import {ClientAttachmentService} from '../../../models/ClientAttachmentService';
const ClientModel = require('../../../models/client');
const ClientReminder = require('../../../models/ClientReminder');
const ClientContact = require('../../../models/ClientContact');
const ClientAttachment = require('../../../models/ClientAttachment');
const ClientNote = require('../../../models/ClientNote');
const CustomField = require('../../../models/CustomField');
const Client = require('../../../models/ClientModel');
const ClientCustomField = require('../../../models/ClientCustomField');
const ClientInitialContact = require('../../../models/ClientInitialContact');
const ClientAvailability = require('../../../models/ClientAvailabilityModel');
const ClientLanguage = require('../../../models/ClientLanguageModel');
const ClientSkill = require('../../../models/ClientSkill');
const MasterFormModel = require('../../../models/masterform');
const fs = require('fs');

module.exports = function(router) {
  router.post('/', token({required: true}), addClient);
  router.get('/', token({required: true}), getCb);
  router.put('/:ClientId', token({required: true}), updateClient);
  router.get('/myinitialcontact/:id', token({required: true}), getMyInitialContact);

  router.get('/common', token({required: true}), getClientCommonInfo);
  router.get('/withcustomfields', token({required: true}), getClientWithCustomFields);

  router.get('/hours/client', token({required: true}), readWithAssignedHours);

  router.get('/referredBy', token({required: true}), getReferredBy);
  router.get('/payor', token({required: true}), getPayor);
  router.get('/physician', token({required: true}), getPhysician);
  router.get('/getrelations', token({required: true}), getRelations);
  router.get('/county', token({required: true}), getCounty);
  router.get('/getInitialContact/', token({required: true}), getInitialContact);
  router.get('/clientType', token({required: true}), getClientType);
  router.get('/caseManager', token({required: true}), getCaseManager);
  router.get('/reminderDescription', token({required: true}), reminderDescription);
  router.post('/locationdata', token({required: true}), getLocation);

  router.delete('/ClientId', token({required: true}), deleteCb);
  router.get('/:ClientId', token({required: true}), getByIdCb);
  router.get('/:ClientId/all', token({required: true}), getAllInformationForClient);

  router.get('/reminder/all/all', token({required: true}), getAllReminders);

  router.post('/getInitialContact/', token({required: true}), getInitialContact);
  router.post('/addInitialContact/', token({required: true}), addInitialContact);
  router.post('/updateInitialContact/', token({required: true}), updateInitialContact);

  router.get('/:ClientId/reminders', token({required: true}), getReminderById);
  router.post('/:ClientId/reminders', token({required: true}), insertReminder);
  router.put('/:ClientId/reminders/:ExpirationID', token({required: true}), updateReminder);
  router.delete('/:ClientId/reminders/:ExpirationID', token({required: true}), deleteReminder);

  router.get('/:ClientId/attachments', token({required: true}), getAttachementById);
  router.post('/:ClientId/attachments', token({required: true}), postAttachementById);
  router.put(
    '/:ClientId/attachments/:attachmentId',
    token({required: true}),
    updateAttachementById
  );
  router.delete(
    '/:ClientId/attachments/:attachmentId',
    token({required: true}),
    deleteAttachementById
  );

  router.get('/:ClientId/visits', token({required: true}), getVisitsByIdCb);

  router.get('/:ClientId/contacts', token({required: true}), getContactsById);
  router.delete('/:ClientId/contacts/:ContactID', token({required: true}), deleteContact);
  router.post('/:ClientId/contacts', token({required: true}), createContact);
  router.put('/:ClientId/contacts/:ContactID', token({required: true}), updateContact);

  router.get('/:ClientId/notes', token({required: true}), getNotesForClient);
  router.post('/:ClientId/notes', token({required: true}), createNote);
  router.put('/:ClientId/notes/:NoteDate/:NoteTime', token({required: true}), updateNote);
  router.delete('/:ClientId/notes/:NoteDate/:NoteTime', token({required: true}), deleteNote);

  router.get('/:ClientId/customfields', token({required: true}), getCustomFields);
  router.post('/:ClientId/customfields', token({required: true}), addUpdateCustomFields);
  router.post('/:ClientId/customfields/all', token({required: true}), addUpdateCustomFieldsAll);

  router.post('/:ClientId/languages', token({required: true}), updateClientLanguages);
  router.post('/:ClientId/availabilities', token({required: true}), updateClientAvailabilities);
  router.post('/:ClientId/skills', token({required: true}), updateClientSkills);

  router.get('/:ClientId/attachments/:attachmentId', token({required: true}), getSingleAttachment);
  router.get(
    '/:ClientId/attachments/:attachmentId/download',
    token({required: true}),
    downloadAttachment
  );
  router.post('/:ClientId/skills', token({required: true}), updateClientSkills);

  router.post('/compliance/reports', token({required: true}), getClientComplianceReports);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getCb(req, res, next) {
  const model = new ClientModel();
  model
    .read(req.params, req.division_db, req.query.token, req.query)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

async function getClientWithCustomFields(req, res, next) {
  try {
    const clientService = new ClientService(req.knex, req.user, req.division_db);
    const clients = await clientService.getClientWithCustomFields(req.query);

    // const model = new ClientModel();
    // let response = await model.read(req.params, req.division_db, req.query.token, req.query);
    // let clients = response;
    // // const customFieldModel = new CustomFieldModel();
    // // let clientFields = await customFieldModel.getClientFields(req.division_db, req.query.token);

    // const activeCustomFieldsForClient = await CustomField.query(req.knex).where({
    //   showClient: true
    // });
    // let cfieldsNames = activeCustomFieldsForClient.map(field => field.cfieldName);
    // const clientFields = await ClientCustomField.query(req.knex)
    //   .select('cfieldName', 'descr', 'ClientId')
    //   .whereIn('cfieldName', cfieldsNames);

    // let clientMap = clients.reduce((obj, cur) => {
    //   obj[`${cur.ClientId}`] = cur;
    //   return obj;
    // }, {});
    // clientFields.forEach(cf => {
    //   let client = clientMap[`${cf.ClientId}`];
    //   if (client) {
    //     client[cf.cfieldName] = cf.descr;
    //   }
    // });
    res.status(201).send(clients);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getClientCommonInfo(req, res, next) {
  try {
    const model = new ClientModel();

    let clientNoteTypes = await ClientNote.query(req.knex).select('noteTypeID', 'description');
    const masterFormModel = new MasterFormModel();
    let reasons = await masterFormModel.getReason(req.division_db, req.query.token);

    let initialContacts = await model.getInitialContact(req.division_db, req.query.token);
    let caseManagers = await model.getCaseManager(req.division_db, req.query.token);
    let relations = await model.getRelations(req.division_db, req.query.token);
    let reminderDescriptions = await model.reminderDescription(req.division_db, req.query.token);
    let locationData = await model.getLocation(req.division_db, req.query.token);
    let referredBy = await model.getReferredBy(req.division_db, req.query.token);
    let payors = await model.getPayor(req.division_db, req.query.token);
    let physicians = await model.getPhysician(req.division_db, req.query.token);
    let clientTypes = await model.getClientType(req.division_db, req.query.token);
    let counties = await model.getCounty(req.division_db, req.query.token);

    res.status(201).send({
      clientNoteTypes,
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
      counties
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
function readWithAssignedHours(req, res, next) {
  const model = new ClientModel();
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
    const client = await Client.query(req.knex).findById(req.params.ClientId);
    let initialContact;
    if (!client) {
      throw new Error('Client not found');
    }
    if (client.InitialContactID) {
      initialContact = await ClientInitialContact.query(req.knex).findById(client.InitialContactID);
    }
    res.status(201).send({...client, initialContact});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getAllInformationForClient(req, res) {
  try {
    const {ClientId} = req.params;
    const personaldata = await Client.query(req.knex).findById(ClientId);
    if (!personaldata) {
      throw new Error('Can not find client');
    }

    const reminders = await ClientReminder.query(req.knex).where({
      clientID: ClientId
    });
    const attachments = await ClientAttachment.query(req.knex)
      .where({
        clientID: ClientId
      })
      .select('clientID', 'attachmentId', 'descr');
    const notes = await ClientNote.query(req.knex)
      .where({
        ClientId: ClientId
      })
      .orderBy('NoteDate', 'desc');
    const customfields = await ClientCustomField.query(req.knex)
      .select('cfieldName', 'descr', 'ClientId')
      .where('ClientId', ClientId);
    const availabilities = await ClientAvailability.query(req.knex).where({
      ClientId: ClientId
    });
    const languages = await ClientLanguage.query(req.knex).where({
      ClientId: ClientId
    });
    const skills = await ClientSkill.query(req.knex).where({
      clientID: ClientId
    });
    const contacts = await ClientContact.query(req.knex).where({
      ClientId: ClientId
    });
    if (personaldata.InitialContactID) {
      const initialContact = await ClientInitialContact.query(req.knex).findById(
        personaldata.InitialContactID
      );
      if (initialContact) {
        personaldata.initialContact = initialContact;
      }
    }
    res.status(200).send({
      personaldata,
      reminders,
      attachments,
      notes,
      customfields,
      availabilities,
      languages,
      skills,
      contacts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getVisitsByIdCb(req, res, next) {
  const model = new ClientModel();
  model
    .getVisitHistory(req.params.ClientId, req.division_db, req.query.token)
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
function getMyInitialContact(req, res, next) {
  const model = new ClientModel();
  model
    .getMyInitialContact(req.params.id, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 * Contacts Related APIs
 *
 */
async function getContactsById(req, res, next) {
  try {
    const contacts = await ClientContact.query(req.knex).where({
      ClientId: parseInt(req.params.ClientId)
    });
    res.status(200).send(contacts);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const success = await ClientContact.query(req.knex).deleteById([
      parseInt(req.params.ClientId),
      parseInt(req.params.ContactID)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        ClientId: req.params.ClientId,
        ContactID: req.params.ContactID
      });
    } else {
      res.status(500).send({success: false});
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function createContact(req, res, next) {
  try {
    const contact = await ClientContact.query(req.knex).insert({
      ClientId: parseInt(req.params.ClientId),
      ...populateForCreate(req.user, req.body)
    });
    res.status(200).send(contact);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateContact(req, res, next) {
  try {
    const contact = await ClientContact.query(req.knex).updateAndFetchById(
      [req.params.ClientId, req.params.ContactID],
      populateForUpdate(req.user, req.body)
    );
    res.status(200).send(contact);
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
async function addClient(req, res, next) {
  try {
    let {initialContact, ...clientData} = req.body;
    let initialContactData;
    if (initialContact && initialContact.Name) {
      initialContactData = await ClientInitialContact.query(req.knex)
        .returning('*')
        .insert(populateForCreate(req.user, initialContact));
      clientData.InitialContactID = initialContactData.InitialContactID;
    }
    await ClientService.updateLatLng(clientData);

    const newClient = await Client.query(req.knex)
      .returning('*')
      .insert(populateForCreate(req.user, clientData));

    res.status(201).send({...newClient, initialContact: initialContactData});
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
async function updateClient(req, res, next) {
  try {
    let {initialContact, ...clientData} = req.body;
    let initialContactData;
    if (initialContact && initialContact.Name) {
      if (clientData.InitialContactID) {
        initialContactData = await ClientInitialContact.query(req.knex).updateAndFetchById(
          clientData.InitialContactID,
          populateForUpdate(req.user, omit(initialContact, 'InitialContactID'))
        );
      } else {
        initialContactData = await ClientInitialContact.query(req.knex)
          .returning('*')
          .insert(populateForCreate(req.user, initialContact));
        clientData.InitialContactID = initialContactData.InitialContactID;
      }
    }
    await ClientService.updateLatLng(clientData);
    const client = await Client.query(req.knex).updateAndFetchById(
      req.params.ClientId,
      populateForUpdate(req.user, clientData)
    );
    if (!initialContactData && client.InitialContactID) {
      initialContactData = await ClientInitialContact.query(req.knex).findById(
        client.InitialContactID
      );
    }
    res.status(200).send({...client, initialContact: initialContactData});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

function addInitialContact(req, res, next) {
  const model = new ClientModel();

  model
    .insertInitialContact(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function updateInitialContact(req, res, next) {
  const model = new ClientModel();

  model
    .updateInitialContact(req.body, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
function updatePhone(req, res, next) {
  const model = new ClientModel();

  model
    .updatePhone(req.body, req.params.clientID, req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// for get all case manager for master form
function reminderDescription(req, res, next) {
  const model = new ClientModel();
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
async function getReminderById(req, res, next) {
  try {
    const reminders = await ClientReminder.query(req.knex).where({
      clientID: parseInt(req.params.ClientId)
    });
    res.status(200).send(reminders);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function insertReminder(req, res, next) {
  try {
    const reminder = await ClientReminder.query(req.knex).insert({
      clientID: parseInt(req.params.ClientId),
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
    const reminder = await ClientReminder.query(req.knex).updateAndFetchById(
      [req.params.ClientId, req.params.ExpirationID],
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
    const success = await ClientReminder.query(req.knex).deleteById([
      parseInt(req.params.ClientId),
      parseInt(req.params.ExpirationID)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        ClientId: req.params.ClientId,
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
async function getNotesForClient(req, res, next) {
  try {
    const notes = await ClientNote.query(req.knex)
      .where({
        ClientId: parseInt(req.params.ClientId)
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
    let NoteDateTime = new Date().getTime() / 1000;

    const note = await ClientNote.query(req.knex).insert({
      ClientId: parseInt(req.params.ClientId),
      ...populateForCreate(req.user, req.body),
      NoteDate,
      NoteTime,
      NoteDateTime
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
      updatData.NoteDateTime = newDate.getTime() / 1000;
    }

    await ClientNote.query(req.knex).updateAndFetchById(
      [req.params.ClientId, new Date(req.params.NoteDate), new Date(req.params.NoteTime)],
      populateForUpdate(req.user, updatData)
    );
    const note = await ClientNote.query(req.knex).findById([
      req.params.ClientId,
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
    const success = await ClientNote.query(req.knex).deleteById([
      parseInt(req.params.ClientId),
      new Date(req.params.NoteDate),
      new Date(req.params.NoteTime)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        ClientId: req.params.ClientId,
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
    const activeCustomFieldsForClient = await CustomField.query(req.knex).where({
      showClient: true
    });
    let cfieldsNames = activeCustomFieldsForClient.map(field => field.cfieldName);
    const customfields = await ClientCustomField.query(req.knex)
      .where({
        ClientId: req.params.ClientId
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
      showClient: true,
      cfieldName: req.body.cfieldName
    });
    if (!existingField) {
      throw new Error('Custom field does not exist');
    }
    let clientField = await ClientCustomField.query(req.knex).findOne({
      ClientId: req.params.ClientId,
      cfieldName: req.body.cfieldName
    });

    if (clientField) {
      clientField = await ClientCustomField.query(req.knex).updateAndFetchById(
        [req.params.ClientId, req.body.cfieldName],
        populateForUpdate(req.user, {descr: req.body.descr})
      );
    } else {
      clientField = await ClientCustomField.query(req.knex).insert({
        ClientId: parseInt(req.params.ClientId),
        ...populateForCreate(req.user, req.body)
      });
    }
    res.status(200).send(clientField);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function addUpdateCustomFieldsAll(req, res, next) {
  try {
    // let {ClientId} = req.params;
    let ClientId = parseInt(req.params.ClientId);
    let fields = req.body.customfields;

    const fieldsWithData = fields.filter(f => f.descr).map(f => f.cfieldName);
    let currentFields = await ClientCustomField.query(req.knex).where('ClientId', ClientId);
    const currentFieldNames = currentFields.map(f => f.cfieldName);
    const currentFieldsMap = currentFields.reduce((obj, cur) => {
      obj[cur.cfieldName] = cur;
      return obj;
    }, {});
    const toDelete = difference(currentFieldNames, fieldsWithData);

    if (toDelete.length > 0) {
      await ClientCustomField.query(req.knex)
        .where('ClientId', ClientId)
        .whereIn('cfieldName', toDelete)
        .delete();
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.descr) {
        if (currentFieldsMap[field.cfieldName]) {
          if (currentFieldsMap[field.cfieldName].descr !== field.descr) {
            await ClientCustomField.query(req.knex).updateAndFetchById(
              [ClientId, field.cfieldName],
              populateForUpdate(req.user, {descr: field.descr})
            );
          }
        } else {
          await ClientCustomField.query(req.knex).insert({
            ClientId: ClientId,
            ...populateForCreate(req.user, field)
          });
        }
      }
    }

    const customfields = await ClientCustomField.query(req.knex).where('ClientId', ClientId);

    res.status(200).send({customfields});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getAttachementById(req, res, next) {
  try {
    const reminders = await ClientAttachment.query(req.knex).where({
      clientId: parseInt(req.params.ClientId)
    });
    res.status(200).send(reminders);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function postAttachementById(req, res, next) {
  try {
    let attachment = fs.readFileSync(req.files.file.path, 'binary');
    var binBuff = new Buffer(attachment, 'binary');

    const documentPath = await ClientAttachmentService.uploadAttachmentForUser(
      {
        clientId: parseInt(req.params.ClientId),
        ...req.body
      },
      binBuff
    );
    const reminder = await ClientAttachment.query(req.knex).insert({
      clientId: parseInt(req.params.ClientId),
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

    const attachmentDoc = await ClientAttachment.query(req.knex).findById([
      parseInt(req.params.ClientId),
      parseInt(req.params.attachmentId)
    ]);
    if (!attachmentDoc) {
      throw new Error('Not found');
    }
    if (req.files && req.files.file && req.files.file.path) {
      let attachment = fs.readFileSync(req.files.file.path, 'binary');
      let binBuff = new Buffer(attachment, 'binary');
      // updateDoc.attachment = binBuff;

      const documentPath = await ClientAttachmentService.uploadAttachmentForUser(
        attachmentDoc,
        binBuff
      );
      updateDoc.documentPath = documentPath;
    }

    const result = await ClientAttachment.query(req.knex).updateAndFetchById(
      [req.params.ClientId, req.params.attachmentId],
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
    const success = await ClientAttachment.query(req.knex).deleteById([
      parseInt(req.params.ClientId),
      parseInt(req.params.attachmentId)
    ]);
    if (success === 1) {
      res.status(200).send({
        success: true,
        ClientId: req.params.ClientId,
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

// for get location
function getLocation(req, res, next) {
  const model = new ClientModel();
  model
    .getLocation(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

/**
 *   for get client all reminders
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getAllReminders(req, res, next) {
  const model = new ClientModel();
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
function deleteCb(req, res, next) {
  const model = new ClientModel();
  model
    .delete(req.body, req.division_db, req.query.token)
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
function inactivateCb(req, res, next) {
  const model = new ClientModel();
  model
    .inactivate(req.body, req.division_db, req.query.token)
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
function activateCb(req, res, next) {
  const model = new ClientModel();
  model
    .activate(req.body, req.division_db, req.query.token)
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
function getReferredBy(req, res, next) {
  const model = new ClientModel();
  model
    .getReferredBy(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getPayor(req, res, next) {
  const model = new ClientModel();
  model
    .getPayor(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getPhysician(req, res, next) {
  const model = new ClientModel();
  model
    .getPhysician(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
function getRelations(req, res, next) {
  const model = new ClientModel();
  model
    .getRelations(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getCounty(req, res, next) {
  const model = new ClientModel();
  model
    .getCounty(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getInitialContact(req, res, next) {
  const model = new ClientModel();
  model
    .getInitialContact(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
function getClientType(req, res, next) {
  const model = new ClientModel();
  model
    .getClientType(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getCaseManager(req, res, nect) {
  const model = new ClientModel();
  model
    .getCaseManager(req.division_db, req.query.token)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

async function updateClientLanguages(req, res, next) {
  try {
    const {ClientId} = req.params;
    const languageIds = req.body.languages.map(l => l.id);
    await ClientLanguage.query(req.knex)
      .where('ClientId', ClientId)
      .whereNotIn('LanguageId', languageIds)
      .delete();

    let existingLanguages = await ClientLanguage.query(req.knex).where('ClientId', ClientId);
    let currentIds = existingLanguages.map(l => l.LanguageId);
    let needsToAdd = difference(languageIds, currentIds);
    for (let i = 0; i < needsToAdd.length; i++) {
      await ClientLanguage.query(req.knex).insert({
        ClientId: parseInt(ClientId),
        LanguageId: needsToAdd[i]
      });
    }

    let languages = languageIds.map(l => ({
      ClientId: ClientId,
      LanguageId: l
    }));
    res.status(200).send({languages});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateClientAvailabilities(req, res, next) {
  try {
    const {ClientId} = req.params;
    const availabilityIds = req.body.availabilities.map(l => l.id);
    await ClientAvailability.query(req.knex)
      .where('ClientId', ClientId)
      .whereNotIn('AvailabilityId', availabilityIds)
      .delete();

    let existingAvailabilities = await ClientAvailability.query(req.knex).where(
      'ClientId',
      ClientId
    );
    let currentIds = existingAvailabilities.map(l => l.AvailabilityId);
    let needsToAdd = difference(availabilityIds, currentIds);
    for (let i = 0; i < needsToAdd.length; i++) {
      await ClientAvailability.query(req.knex).insert({
        ClientId: parseInt(ClientId),
        AvailabilityId: needsToAdd[i]
      });
    }

    let availabilities = availabilityIds.map(l => ({
      ClientId: ClientId,
      AvailabilityId: l
    }));
    res.status(200).send({availabilities});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function updateClientSkills(req, res, next) {
  try {
    const {ClientId} = req.params;
    const skillIds = req.body.skills.map(l => l.SkillId);
    await ClientSkill.query(req.knex)
      .where('clientID', ClientId)
      .whereNotIn('skillId', skillIds)
      .delete();

    let existingSkills = await ClientSkill.query(req.knex).where('clientID', ClientId);
    let currentIds = existingSkills.map(l => l.skillId);
    let needsToAdd = difference(skillIds, currentIds);
    for (let i = 0; i < needsToAdd.length; i++) {
      await ClientSkill.query(req.knex).insert({
        clientID: ClientId,
        skillId: needsToAdd[i]
      });
    }

    let skills = skillIds.map(l => ({
      clientID: ClientId,
      skillId: l
    }));
    res.status(200).send({skills});
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}

async function getSingleAttachment(req, res, next) {
  try {
    const attachment = await ClientAttachment.query(req.knex).findById([
      parseInt(req.params.ClientId),
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
    const clientService = new ClientService(req.knex, req.user, req.division_db);
    const attachment = await clientService.downloadAttachment(
      req.params.ClientId,
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

async function getClientComplianceReports(req, res, next) {
  try {
    // const model = new ClientModel();
    // let response = await model.read(req.params, req.division_db, req.query.token, req.query);
    let expirationDate = req.body.expirationDate;
    let descriptions = req.body.reminderTypes;
    // let fields = req.body.fields;
    let status = req.body.status;
    let reminderMode = req.body.reminderMode;
    const reminderQuery = ClientReminder.query(req.knex)
      .whereIn('description', descriptions)
      .where('expirationDate', '<=', `${expirationDate} 00:00:00.000`)
      .select('clientID', 'description', 'expirationDate');
    if (reminderMode) {
      if (reminderMode === 'A') {
        reminderQuery.where('ReminderOn', true);
      } else {
        reminderQuery.where('ReminderOn', false);
      }
    }
    const reminders = await reminderQuery;
    const clientIds = uniq(reminders.map(r => r.clientID));
    let clientsQuery = Client.query(req.knex); // .whereIn('ClientId', clientIds);
    if (status) {
      clientsQuery = clientsQuery.where('Status', status);
    }

    let clients = await fetchManyRecords(clientsQuery, 'ClientId', clientIds, 300);
    let finalClientIds = clients.map(c => c.ClientId);
    // const customFieldModel = new CustomFieldModel();
    // let clientFields = await customFieldModel.getClientFields(req.division_db, req.query.token);

    let clientMap = clients.reduce((obj, cur) => {
      obj[`${cur.ClientId}`] = cur;
      return obj;
    }, {});

    const activeCustomFieldsForClient = await CustomField.query(req.knex).where('showClient', true);
    // .whereIn('cfieldName', fields);
    if (activeCustomFieldsForClient && activeCustomFieldsForClient.length > 0) {
      let cfieldsNames = activeCustomFieldsForClient.map(field => field.cfieldName);
      const clientFieldsQuery = ClientCustomField.query(req.knex)
        .select('cfieldName', 'descr', 'ClientId')
        .whereIn('cfieldName', cfieldsNames);

      let clientFields = await fetchManyRecords(clientFieldsQuery, 'ClientId', finalClientIds, 200);

      clientFields.forEach(cf => {
        let client = clientMap[`${cf.ClientId}`];
        if (client) {
          client[cf.cfieldName] = cf.descr;
        }
      });
    }
    reminders.forEach(cf => {
      let client = clientMap[`${cf.clientID}`];
      if (client) {
        try {
          client[cf.description] = moment(cf.expirationDate).format('YYYY-MM-DD');
        } catch (err) {}
      }
    });
    res.status(201).send(clients);
  } catch (error) {
    console.error('Error', error);
    res.status(500).send(error);
  }
}
