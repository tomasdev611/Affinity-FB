const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class LocationModel extends BaseModel {
  static idColumn = 'str_locationid';
  static columnsForFetch = ['str_locationid'];

  static creatorTimeFields = ['str_createdBy', 'dtm_created', 'str_updatedBy', 'dtm_lastUpdated'];

  static get tableName() {
    return 'dbo.tbl_location';
  }

  static get jsonSchema() {
    return {
      properties: {
        str_locationid: {type: ['string'], maxLength: 3},

        str_createdBy: {type: ['string', 'null'], maxLength: 15},
        dtm_created: {type: ['string', 'null']},
        str_updatedBy: {type: ['string', 'null'], maxLength: 15},
        dtm_lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = LocationModel;
