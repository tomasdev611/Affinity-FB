const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class Reason extends BaseModel {
  static idColumn = ['str_reason'];
  static columnsForFetch = ['str_reason', 'bit_caregiver', 'bit_client'];

  static creatorTimeFields = ['str_createdBy', 'dtm_created', 'str_updatedBy', 'dtm_lastUpdated'];

  static get tableName() {
    return 'dbo.tbl_reasons';
  }

  static get jsonSchema() {
    return {
      properties: {
        str_reason: {type: 'string', maxLength: 25},
        int_sortorder: {type: ['integer', 'null']},

        str_createdBy: {type: ['string', 'null'], maxLength: 15},
        dtm_created: {type: ['string', 'null']},
        str_updatedBy: {type: ['string', 'null'], maxLength: 15},
        dtm_lastUpdated: {type: ['string', 'null']},

        bit_caregiver: {type: ['boolean', 'null']},
        bit_client: {type: ['boolean', 'null']}
      }
    };
  }
}

module.exports = Reason;
