import {lit} from 'objection';
import {generateAddressHash} from '../lib/helpers';
import {GoogleMapService} from '../services/googlemap';
import ClientAttachment from './ClientAttachment';
import {AWSService} from '../services/aws';
import ClientCustomField from './ClientCustomField';
import CustomField from './CustomField';
import Client from './ClientModel';
import Schedule from './ScheduleModel';
import ClientNote from './ClientNote';

export class ClientService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    // this.db = database.getDb();
  }

  static async updateLatLng(client) {
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
          client.lat = lit(location.lat).castFloat();
          client.lng = lit(location.lng).castFloat();
          client.addressHash = addressHash;
          return;
        }
      } catch (err) {}
    }
    if (client.lat) {
      client.lat = lit(client.lat).castFloat();
      client.lng = lit(client.lng).castFloat();
    }
  }

  static async addFormattedNumber(clientData) {
    // if (clientData.Phone) {
    //   const PhoneFormatted = MessageService.getPhoneNumber(clientData.Phone);
    //   if (PhoneFormatted) {
    //     clientData.PhoneFormatted = PhoneFormatted;
    //   }
    // }
  }

  async downloadAttachment(ClientId, attachmentId) {
    const attachment = await ClientAttachment.query(this.knex).findById([
      parseInt(ClientId),
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

  async getClientWithCustomFields(query) {
    const clientQuery = Client.query(this.knex).orderBy('ClientId', 'desc');
    let clientIds;
    console.log('HALEO', query);
    if (query.SocialSecurityNum) {
      const schedules = await Schedule.query(this.knex)
        .where('SocialSecNum', query.SocialSecurityNum)
        .distinct('ClientId');
      clientIds = schedules.map(s => s.ClientId);
      clientQuery.whereIn('ClientId', clientIds);
    }
    let response = await clientQuery;
    let clients = response;

    const activeCustomFieldsForClient = await CustomField.query(this.knex).where({
      showClient: true
    });
    let cfieldsNames = activeCustomFieldsForClient.map(field => field.cfieldName);
    const clientCustomFieldQuery = ClientCustomField.query(this.knex)
      .select('cfieldName', 'descr', 'ClientId')
      .whereIn('cfieldName', cfieldsNames);
    if (clientIds) {
      clientCustomFieldQuery.whereIn('ClientId', clientIds);
    }
    const clientFields = await clientCustomFieldQuery;

    let clientMap = clients.reduce((obj, cur) => {
      obj[`${cur.ClientId}`] = cur;
      return obj;
    }, {});
    clientFields.forEach(cf => {
      let client = clientMap[`${cf.ClientId}`];
      if (client) {
        client[cf.cfieldName] = cf.descr;
      }
    });

    // if (query.showFirstLastVisit) {
    const scheduleQuery = Schedule.query(this.knex)
      .select(this.knex.raw(`Min(Date) as FirstVisitDate, Max(Date) as LastVisitDate, ClientId`))
      .groupBy('ClientId');
    if (clientIds) {
      scheduleQuery.whereIn('ClientId', clientIds);
    }
    const firstLastVisits = await scheduleQuery;
    firstLastVisits.forEach(vis => {
      let client = clientMap[`${vis.ClientId}`];
      if (client) {
        client.FirstVisitDate = vis.FirstVisitDate;
        client.LastVisitDate = vis.LastVisitDate;
      }
    });
    // }
    return clients;
  }

  async updateNotesTime() {
    const allNotes = await ClientNote.query(this.knex)
      .where('NoteDate', '>=', '2019-10-19')
      .select('NoteDate', 'NoteTime', 'ClientId', 'created', 'lastUpdated')
      .orderBy('created', 'desc');
    for (let i = 0; i < allNotes.length; i++) {
      const note = allNotes[i];
      const createdDate = new Date(note.created).getTime();
      const updatedDate = new Date(note.lastUpdated).getTime();
      if (Math.abs(updatedDate - createdDate) < 1000) {
        const noteDateTime = `${note.NoteDate.toISOString().substr(
          0,
          10
        )}${note.NoteTime.toISOString().substr(10)}`;
        const noteUtc = new Date(noteDateTime).getTime();

        if (Math.abs(noteUtc - createdDate) > 100000) {
          // Then we take this as the one needs time update.
          const time = note.created
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '');
          await ClientNote.query(this.knex).updateAndFetchById(
            [note.ClientId, note.NoteDate, note.NoteTime],
            {ClientId: note.ClientId, NoteDate: time, NoteTime: time}
          );
        }
      }
    }
  }
}
