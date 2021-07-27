const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverCustomField extends BaseModel {
  static idColumn = ['SocialSecNum', 'cfieldName'];

  static get tableName() {
    return 'dbo.CaregiverCustomFields';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecNum: {type: 'string', maxLength: 9},
        cfieldName: {type: 'string', maxLength: 25},
        descr: {type: ['string', 'null'], maxLength: 50},
        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CaregiverCustomField;
