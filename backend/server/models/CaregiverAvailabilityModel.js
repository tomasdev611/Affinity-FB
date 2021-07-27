const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverAvailabilityModel extends BaseModel {
  static idColumn = ['SocialSecurityNum', 'AvailabilityId'];

  static get tableName() {
    return 'dbo.caregiverAvailabilities';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
        AvailabilityId: {type: 'integer'}
      }
    };
  }
}

module.exports = CaregiverAvailabilityModel;
