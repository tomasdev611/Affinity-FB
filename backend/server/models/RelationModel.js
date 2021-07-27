const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class RelationModel extends BaseModel {
  static idColumn = 'intRelation';
  static columnsForFetch = ['intRelation', 'strRelation'];

  static creatorTimeFields = [];

  static get tableName() {
    return 'dbo.InitialContactRelation';
  }

  static get jsonSchema() {
    return {
      properties: {
        intRelation: {type: 'integer'},
        strRelation: {type: ['string', 'null'], maxLength: 50}
      }
    };
  }
}

module.exports = RelationModel;
