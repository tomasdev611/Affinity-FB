const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class SecurityUserGroup extends BaseModel {
  static idColumn = ['str_userName', 'str_locationID'];

  static get tableName() {
    return 'dbo.tbl_securityusers_location';
  }

  static get jsonSchema() {
    return {
      properties: {
        str_userName: {type: 'string', maxLength: 100},
        str_locationID: {type: 'string', maxLength: 3}
      }
    };
  }
}

module.exports = SecurityUserGroup;
