const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ApplicantImageModel extends BaseModel {
  static idColumn = ['SocialSecurityNum'];

  static get tableName() {
    return 'dbo.tbl_images_applicant';
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

module.exports = ApplicantImageModel;
