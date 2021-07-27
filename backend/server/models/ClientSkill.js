const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientSkillModel extends BaseModel {
  static idColumn = ['clientId', 'skillId'];

  static get tableName() {
    return 'dbo.ClientNeeds';
  }

  static get jsonSchema() {
    return {
      properties: {
        clientId: {type: 'integer'},
        skillId: {type: 'integer'},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ClientSkillModel;
