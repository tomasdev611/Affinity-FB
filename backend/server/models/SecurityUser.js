const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class SecurityUser extends BaseModel {
  static idColumn = ['userName'];
  static columnsForFetch = ['userName', 'twilioNumber', 'maximumGroupMemberCount'];
  static creatorTimeFields = [];

  static get tableName() {
    return 'dbo.securityUsers';
  }

  static get jsonSchema() {
    return {
      properties: {
        userName: {type: 'string', maxLength: 100},
        userPassword: {type: ['string', 'null'], maxLength: 256},
        enabled: {type: ['boolean', 'null']},
        str_email: {type: ['string', 'null'], maxLength: 100},
        twilioNumber: {type: ['string', 'null'], maxLength: 20},
        maximumGroupMemberCount: {type: ['integer', 'null']},
        bit_allClass: {type: ['boolean', 'null']},
        bit_allLocation: {type: ['boolean', 'null']},
        UserType: {type: ['string', 'null'], maxLength: 50},
        UserReferenceID: {type: ['string', 'null'], maxLength: 9},
        IncorrectAttempts: {type: ['integer', 'null']},
        LastFailedAttempt: {type: ['string', 'null'], maxLength: 15},
        password2: {type: ['string', 'null'], maxLength: 200}
      }
    };
  }
}

module.exports = SecurityUser;
