const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CustomField extends BaseModel {
  static idColumn = 'cfieldName';
  static columnsForFetch = ['cfieldName', 'showCaregiver', 'showClient'];

  static get tableName() {
    return 'dbo.CustomFields';
  }

  static get jsonSchema() {
    return {
      properties: {
        cfieldName: {type: 'string', maxLength: 25},
        showCaregiver: {type: 'boolean'},
        showClient: {type: 'boolean'},
        cdataType: {type: ['string', 'null'], maxLength: 15},
        printOnInfoSumm: {type: 'boolean'},
        sortOrder: {type: ['integer', 'null']},
        status: {type: 'boolean'},
        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CustomField;
