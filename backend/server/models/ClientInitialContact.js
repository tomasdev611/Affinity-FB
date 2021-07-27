const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientInitialContact extends BaseModel {
  static idColumn = ['InitialContactID'];
  static columnsForFetch = [
    'InitialContactID',
    'Name',
    'Address1',
    'Address2',
    'City',
    'State',
    'Zip',
    'Relation',
    'Email',
    'Phone'
  ];

  static get tableName() {
    return 'dbo.InitialContact';
  }

  static get jsonSchema() {
    return {
      properties: {
        InitialContactID: {type: 'integer'},
        Name: {type: ['string', 'null'], maxLength: 50},
        Address1: {type: ['string', 'null'], maxLength: 80},
        Address2: {type: ['string', 'null'], maxLength: 80},
        City: {type: ['string', 'null'], maxLength: 30},
        State: {type: ['string', 'null'], maxLength: 2},
        Zip: {type: ['string', 'null'], maxLength: 10},
        Relation: {type: ['integer', 'null']},

        Email: {type: ['string', 'null'], maxLength: 50},
        Phone: {type: ['string', 'null'], maxLength: 50},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClientInitialContact;
