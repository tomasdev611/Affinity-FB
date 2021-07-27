const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class MessageTemplateModel extends BaseModel {
  static idColumn = 'id';
  static columnsForFetch = ['id', 'name', 'message'];
  static creatorTimeFields = [];

  static get tableName() {
    return 'dbo.messageTemplates';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        name: {type: ['string', 'null'], maxLength: 100},
        message: {type: ['string', 'null'], maxLength: 1000}
      }
    };
  }
}

module.exports = MessageTemplateModel;
