const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class SkillModel extends BaseModel {
  static idColumn = 'SkillId';
  static columnsForFetch = ['SkillId', 'Description', 'caregiver', 'client'];

  static get tableName() {
    return 'dbo.skills';
  }

  static get jsonSchema() {
    return {
      properties: {
        SkillId: {type: 'integer'},
        Description: {type: ['string', 'null'], maxLength: 80},
        SortOrder: {type: ['integer', 'null']},

        caregiver: {type: ['boolean', 'null']},
        client: {type: ['boolean', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = SkillModel;
