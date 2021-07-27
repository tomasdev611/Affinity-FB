const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientContact extends BaseModel {
  static idColumn = ['ClientId', 'ContactID'];

  static get tableName() {
    return 'dbo.contacts';
  }

  static get jsonSchema() {
    return {
      properties: {
        ClientId: {type: 'integer'},
        ContactID: {type: 'integer'},
        Name: {type: ['string', 'null'], maxLength: 50},
        ContactEmail: {type: ['string', 'null'], maxLength: 30},
        OtherContactInfo: {type: ['string', 'null'], maxLength: 6000},
        Phone: {type: ['string', 'null'], maxLength: 21},
        Fax: {type: ['string', 'null'], maxLength: 21},
        sortOrder: {type: ['integer', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClientContact;
