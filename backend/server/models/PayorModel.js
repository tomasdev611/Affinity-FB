const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class PayorModel extends BaseModel {
  static idColumn = 'PayorId';
  static columnsForFetch = [
    'PayorId',
    'BAddress1',
    'BAddress2',
    'BCity',
    'BState',
    'BZip',
    'notes',
    'BAddress3'
  ];

  static get tableName() {
    return 'dbo.payor';
  }

  static get jsonSchema() {
    return {
      properties: {
        PayorId: {type: 'integer'},

        BAddress1: {type: ['string'], maxLength: 80},
        BAddress2: {type: ['string'], maxLength: 80},
        BCity: {type: ['string'], maxLength: 30},
        BState: {type: ['string'], maxLength: 2},
        BZip: {type: ['string'], maxLength: 10},
        notes: {type: ['string'], maxLength: 6000},
        BAddress3: {type: ['string'], maxLength: 41},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = PayorModel;
