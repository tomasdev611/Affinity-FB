const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class SecurityGroup extends BaseModel {
  static idColumn = ['GroupId'];

  static get tableName() {
    return 'dbo.securityGroups';
  }

  static get jsonSchema() {
    return {
      properties: {
        GroupId: {type: 'string', maxLength: 50},
        Descr: {type: 'string', maxLength: 500},
        bit_reportgroup: {type: ['boolean', 'null']}
      }
    };
  }
}

module.exports = SecurityGroup;
