const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverSkillModel extends BaseModel {
  static idColumn = ['SocialSecurityNum', 'SkillId'];

  static get tableName() {
    return 'dbo.ee_skills';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
        SkillId: {type: 'integer'},

        ExpirationDate: {type: ['string', 'null']},
        Notes: {type: ['string', 'null'], maxLength: 255},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = CaregiverSkillModel;
