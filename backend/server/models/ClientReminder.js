const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientReminder extends BaseModel {
  static idColumn = ['clientID', 'ExpirationID'];

  static get tableName() {
    return 'dbo.clientReminders';
  }

  static get jsonSchema() {
    return {
      properties: {
        clientID: {type: 'integer'},
        ExpirationID: {type: 'integer'},
        description: {type: ['string', 'null'], maxLength: 25},
        expirationDate: {type: ['string', 'null']},
        Notes: {type: ['string', 'null'], maxLength: 255},
        ReminderOn: {type: ['boolean', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClientReminder;
