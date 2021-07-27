const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class LanguageModel extends BaseModel {
  static idColumn = 'id';
  static columnsForFetch = ['id', 'name'];
  static creatorTimeFields = [];

  static get tableName() {
    return 'dbo.languages';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        name: {type: ['string', 'null'], maxLength: 80}
      }
    };
  }
}

module.exports = LanguageModel;
