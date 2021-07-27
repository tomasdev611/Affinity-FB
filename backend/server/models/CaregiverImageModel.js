const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class CaregiverImageModel extends BaseModel {
  static idColumn = ['SocialSecurityNum'];

  static get tableName() {
    return 'dbo.tbl_images_employee';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
        bin_image: {type: 'image'}
      }
    };
  }
}

module.exports = CaregiverImageModel;
