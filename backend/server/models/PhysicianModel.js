const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class PhysicianModel extends BaseModel {
  static idColumn = 'PhysicianName';
  static columnsForFetch = [
    'PhysicianName',
    'Address1',
    'Address2',
    'City',
    'State',
    'Zip',
    'Phone',
    'Fax',
    'AltPhone',
    'Notes',
    'Email'
  ];

  static get tableName() {
    return 'dbo.physician';
  }

  static get jsonSchema() {
    return {
      properties: {
        PhysicianName: {type: ['string'], maxLength: 255},
        Address1: {type: ['string', null], maxLength: 50},
        Address2: {type: ['string', null], maxLength: 50},
        City: {type: ['string', null], maxLength: 50},
        State: {type: ['string', null], maxLength: 50},
        Zip: {type: ['string', null], maxLength: 50},
        Phone: {type: ['string', null], maxLength: 50},
        Fax: {type: ['string', null], maxLength: 50},
        AltPhone: {type: ['string', null], maxLength: 50},
        Notes: {type: ['string', null], maxLength: 3000},
        Email: {type: ['string', null], maxLength: 50},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = PhysicianModel;
