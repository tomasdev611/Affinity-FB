const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class PhoneNumberModel extends BaseModel {
  static idColumn = 'id';
  static columnsForFetch = ['id', 'PhoneNumber'];
  static creatorTimeFields = [];

  static get tableName() {
    return 'dbo.phoneNumbers';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        PhoneNumber: {type: ['string', 'null'], maxLength: 50}
        // userName: {type: 'string', maxLength: 100},
        // type: {type: 'string', maxLength: 10}
      }
    };
  }
}

module.exports = PhoneNumberModel;
