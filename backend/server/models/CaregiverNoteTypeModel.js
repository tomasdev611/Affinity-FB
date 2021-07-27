const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverNoteTypeModel extends BaseModel {
  static idColumn = 'noteTypeID';
  static columnsForFetch = ['noteTypeID', 'description', 'outlookSync'];

  static get tableName() {
    return 'dbo.caregiverNoteType';
  }

  static get jsonSchema() {
    return {
      properties: {
        noteTypeID: {type: 'integer'},
        description: {type: ['string'], maxLength: 20},
        outlookSync: {type: ['integer', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CaregiverNoteTypeModel;
