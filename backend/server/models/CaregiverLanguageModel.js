const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverLanguageModel extends BaseModel {
  static idColumn = ['SocialSecurityNum', 'LanguageId'];

  static get tableName() {
    return 'dbo.caregiverLanguages';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
        LanguageId: {type: 'integer'}
      }
    };
  }
}

module.exports = CaregiverLanguageModel;
