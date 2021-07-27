const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientLanguageModel extends BaseModel {
  static idColumn = ['ClientId', 'LanguageId'];

  static get tableName() {
    return 'dbo.clientLanguages';
  }

  static get jsonSchema() {
    return {
      properties: {
        ClientId: {type: 'integer'},
        LanguageId: {type: 'integer'}
      }
    };
  }
}

module.exports = ClientLanguageModel;
