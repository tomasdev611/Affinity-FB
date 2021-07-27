const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CountyModel extends BaseModel {
  static idColumn = 'id';
  static columnsForFetch = ['id', 'county'];

  static get tableName() {
    return 'dbo.switch_county';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        county: {type: ['string', 'null'], maxLength: 100},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CountyModel;
