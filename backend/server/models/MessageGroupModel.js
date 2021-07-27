const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class MessageGroupModel extends BaseModel {
  static idColumn = 'GroupId';

  static get tableName() {
    return 'dbo.messageGroups';
  }

  static get jsonSchema() {
    return {
      properties: {
        GroupId: {type: 'string', maxLength: 4},
        name: {type: 'string', maxLength: 1000}, // Name of the group
        groupSize: {type: 'integer'}, // Name of the group
        isCaregiverGroup: {type: 'boolean'}, // Name of the group
        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = MessageGroupModel;
