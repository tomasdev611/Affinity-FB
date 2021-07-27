const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaseManagerModel extends BaseModel {
  static idColumn = 'CaseManagerId';
  static columnsForFetch = [
    'CaseManagerId',
    'LastName',
    'FirstName',
    'AgencyName',
    'Ext',
    'Phone',
    'Fax',
    'email',
    'phone2'
  ];

  static get tableName() {
    return 'dbo.casemanager';
  }

  static get jsonSchema() {
    return {
      properties: {
        CaseManagerId: {type: 'integer'},
        LastName: {type: ['string', 'null'], maxLength: 25},
        FirstName: {type: ['string', 'null'], maxLength: 25},
        AgencyName: {type: ['string', 'null'], maxLength: 40},
        Ext: {type: ['string', 'null'], maxLength: 10},
        Phone: {type: ['string', 'null'], maxLength: 21},
        Fax: {type: ['string', 'null'], maxLength: 21},
        email: {type: ['string', 'null'], maxLength: 50},
        phone2: {type: ['string', 'null'], maxLength: 25},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CaseManagerModel;
