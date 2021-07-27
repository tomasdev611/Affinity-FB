const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ServiceModel extends BaseModel {
  static idColumn = 'ServiceCode';
  static columnsForFetch = ['ServiceCode', 'description', 'outlookSync'];

  static get tableName() {
    return 'dbo.services';
  }

  static get jsonSchema() {
    return {
      properties: {
        ServiceCode: {type: 'integer'},
        Description: {type: ['string', 'null'], maxLength: 30},
        ShortDescription: {type: ['string', 'null'], maxLength: 10},

        Cost: {type: ['integer', 'null']}, // Money Type
        ItemTypeId: {type: ['integer', 'null']},

        QuickBooksId: {type: ['string', 'null'], maxLength: 30},
        flatRate: {type: ['boolean', 'null']},

        AlternateServiceID1: {type: ['string', 'null'], maxLength: 50},
        status: {type: ['string', 'null'], maxLength: 1},

        region8ID: {type: ['integer', 'null']},

        modifier: {type: ['string', 'null'], maxLength: 10},
        tos: {type: ['string', 'null'], maxLength: 10},
        modifier2: {type: ['string', 'null'], maxLength: 10},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ServiceModel;
