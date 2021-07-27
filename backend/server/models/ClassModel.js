const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClassModel extends BaseModel {
  static idColumn = 'className';
  static columnsForFetch = ['className', 'classListId'];

  static get tableName() {
    return 'dbo.class';
  }

  static get jsonSchema() {
    return {
      properties: {
        className: {type: ['string'], maxLength: 200},
        classListId: {type: ['string', 'null'], maxLength: 30},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClassModel;
