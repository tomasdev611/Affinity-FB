const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ClienAttachment extends BaseModel {
  static idColumn = ['clientId', 'attachmentId'];

  static get tableName() {
    return 'dbo.clientAttachments';
  }

  static get jsonSchema() {
    return {
      properties: {
        clientId: {type: 'integer'},
        attachmentId: {type: 'integer'},
        descr: {type: ['string', 'null'], maxLength: 500},

        // attachment: {type: ['string', 'null']},
        documentPath: {type: ['string', 'null'], maxLength: 2000},
        str_filename: {type: ['string', 'null'], maxLength: 1000},
        updated_Path: {type: ['string', 'null'], maxLength: 2200},
        updated_FileName: {type: ['string', 'null'], maxLength: 500}
      }
    };
  }
}

module.exports = ClienAttachment;
