const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ApplicantAttachment extends BaseModel {
  static idColumn = ['socialSecNum', 'attachmentId'];

  static get tableName() {
    return 'dbo.ApplicantAttachments';
  }

  static get jsonSchema() {
    return {
      properties: {
        socialSecNum: {type: 'string', maxLength: 9},
        attachmentId: {type: 'integer'},
        descr: {type: ['string', 'null'], maxLength: 500},

        attachment: {type: ['string', 'null']},
        documentPath: {type: ['string', 'null'], maxLength: 2000},
        str_filename: {type: ['string', 'null'], maxLength: 1000},
        Updated_Path: {type: ['string', 'null'], maxLength: 2200},
        Updated_FileName: {type: ['string', 'null'], maxLength: 500}
      }
    };
  }
}

module.exports = ApplicantAttachment;
