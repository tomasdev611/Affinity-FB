const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class SecurityUserGroup extends BaseModel {
  static idColumn = ['str_userName', 'str_className'];

  static get tableName() {
    return 'dbo.tbl_securityusers_class';
  }

  static get jsonSchema() {
    return {
      properties: {
        str_userName: {type: 'string', maxLength: 100},
        str_className: {type: 'string', maxLength: 200}
      }
    };
  }
}

module.exports = SecurityUserGroup;
