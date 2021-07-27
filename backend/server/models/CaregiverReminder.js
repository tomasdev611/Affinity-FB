const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverReminder extends BaseModel {
  static idColumn = ['SocialSecurityNum', 'ExpirationID'];

  static get tableName() {
    return 'dbo.employeeExpirations';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
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

module.exports = CaregiverReminder;
