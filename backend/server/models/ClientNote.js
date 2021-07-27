const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientNote extends BaseModel {
  static idColumn = ['ClientId', 'NoteDate', 'NoteTime'];

  static get tableName() {
    return 'dbo.clientNotes';
  }

  static get jsonSchema() {
    return {
      properties: {
        ClientId: {type: 'integer'},
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

module.exports = ClientNote;
