const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientTypeModel extends BaseModel {
  static idColumn = 'clientTypeID';
  static columnsForFetch = ['clientTypeID', 'Name', 'quickBooksId', 'shortDescr'];

  static get tableName() {
    return 'dbo.ClientType';
  }

  static get jsonSchema() {
    return {
      properties: {
        clientTypeID: {type: 'integer'},
        Name: {type: ['string', 'null'], maxLength: 31},
        quickBooksId: {type: ['string', 'null'], maxLength: 30},
        shortDescr: {type: ['string', 'null'], maxLength: 9},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClientTypeModel;
