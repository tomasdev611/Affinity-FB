const Model = require('objection').Model;
const CaregiverModel = require('./CaregiverModel');
const BaseModel = require('./BaseModel');

class MessageGroupMemberModel extends BaseModel {
  static idColumn = 'id';

  static get tableName() {
    return 'dbo.messageGroupMembers';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        GroupId: {type: 'string', maxLength: 4},
        SocialSecurityNum: {type: ['string', 'null'], maxLength: 9},
        ClientId: {type: ['integer', 'null']}
      }
    };
  }

  static get relationMappings() {
    return {
      caregiver: {
        relation: Model.BelongsToOneRelation,
        modelClass: CaregiverModel,
        join: {
          from: 'dbo.messageGroupMembers.SocialSecurityNum',
          to: 'dbo.employee.SocialSecurityNum'
        }
      }
    };
  }
}

module.exports = MessageGroupMemberModel;
