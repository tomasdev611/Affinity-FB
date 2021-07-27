const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class AvailabilityModel extends BaseModel {
  static idColumn = 'id';
  static columnsForFetch = ['id', 'name', 'caregiver', 'client'];
  static creatorTimeFields = [];

  static get tableName() {
    return 'dbo.availabilities';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        name: {type: ['string', 'null'], maxLength: 80},
        caregiver: {type: ['boolean', 'null']},
        client: {type: ['boolean', 'null']}
      }
    };
  }
}

module.exports = AvailabilityModel;
