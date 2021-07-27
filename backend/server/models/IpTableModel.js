const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class IpTableModel extends BaseModel {
  static idColumn = 'id';

  static get tableName() {
    return 'dbo.ipTables';
  }

  static get jsonSchema() {
    return {
      properties: {
        id: {type: 'integer'},
        IpCIDR: {type: ['string'], maxLength: 300},
        name: {type: ['string'], maxLength: 300},
        isActive: {type: ['boolean', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = IpTableModel;
