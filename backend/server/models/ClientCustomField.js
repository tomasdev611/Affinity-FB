const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientCustomField extends BaseModel {
  static idColumn = ['ClientId', 'cfieldName'];

  static get tableName() {
    return 'dbo.ClientCustomFields';
  }

  static get jsonSchema() {
    return {
      properties: {
        ClientId: {type: 'integer'},
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

module.exports = ClientCustomField;
