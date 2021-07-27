const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ReminderModel extends BaseModel {
  static idColumn = 'description';
  static columnsForFetch = ['description', 'caregivers', 'client'];

  static get tableName() {
    return 'dbo.Reminders';
  }

  static get jsonSchema() {
    return {
      properties: {
        description: {type: ['string'], maxLength: 25},
        sortOrder: {type: ['integer', 'null']},

        caregivers: {type: ['boolean', 'null']},
        client: {type: ['boolean', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ReminderModel;
