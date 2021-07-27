const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class SecurityUserGroup extends BaseModel {
  static idColumn = ['userName', 'GroupId'];

  static get tableName() {
    return 'dbo.securityUserGroups';
  }

  static get jsonSchema() {
    return {
      properties: {
        userName: {type: 'string', maxLength: 100},
        GroupId: {type: 'string', maxLength: 50},
        bit_read: {type: ['boolean', 'null']},
        bit_update: {type: ['boolean', 'null']},
        bit_delete: {type: ['boolean', 'null']}
      }
    };
  }
}

module.exports = SecurityUserGroup;
