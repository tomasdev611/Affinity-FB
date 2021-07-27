const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClientAvailabilityModel extends BaseModel {
  static idColumn = ['ClientId', 'AvailabilityId'];

  static get tableName() {
    return 'dbo.clientAvailabilities';
  }

  static get jsonSchema() {
    return {
      properties: {
        ClientId: {type: 'integer'},
        AvailabilityId: {type: 'integer'}
      }
    };
  }
}

module.exports = ClientAvailabilityModel;
