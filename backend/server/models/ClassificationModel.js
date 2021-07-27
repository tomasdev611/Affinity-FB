const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClassificationModel extends BaseModel {
  static idColumn = 'ClassificationID';
  static columnsForFetch = ['ClassificationID', 'Description'];

  static get tableName() {
    return 'dbo.classification';
  }

  static get jsonSchema() {
    return {
      properties: {
        ClassificationID: {type: 'integer'},
        Description: {type: ['string', 'null'], maxLength: 25},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClassificationModel;
