const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverNote extends BaseModel {
  static idColumn = ['socialSecNum', 'NoteDate', 'NoteTime'];

  static get tableName() {
    return 'dbo.caregiverNotes';
  }

  static get jsonSchema() {
    return {
      properties: {
        socialSecNum: {type: 'string', maxLength: 9},
        NoteDate: {type: ['string', 'null']},
        NoteTime: {type: ['string', 'null']},

        Description: {type: ['string', 'null'], maxLength: 8000},
        noteTypeID: {type: ['integer', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 100},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CaregiverNote;
