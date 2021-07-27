const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ReferredbyModel extends BaseModel {
  static idColumn = 'ReferredById';
  static columnsForFetch = [
    'ReferredById',
    'Name',
    'Company',
    'Phone',
    'Address',
    'Notes',
    'email',
    'Salutation',
    'Title',
    'Department',
    'Website',
    'Mobile',
    'ReferralStatus',
    'Fax',
    'referralStatusId',
    'ReferralCity',
    'ReferralState',
    'ReferralZip',
    'ReferralTypeID'
  ];

  static get tableName() {
    return 'dbo.Referredby';
  }

  static get jsonSchema() {
    return {
      properties: {
        ReferredById: {type: 'integer'},
        Name: {type: ['string', 'null'], maxLength: 100},
        Company: {type: ['string', 'null'], maxLength: 100},
        Phone: {type: ['string', 'null'], maxLength: 50},
        Address: {type: ['string', 'null'], maxLength: 255},
        Notes: {type: ['string', 'null'], maxLength: 2000},
        email: {type: ['string'], maxLength: 50},
        Salutation: {type: ['string', 'null'], maxLength: 40},
        Title: {type: ['string', 'null'], maxLength: 100},
        Department: {type: ['string', 'null'], maxLength: 100},
        Website: {type: ['string', 'null'], maxLength: 255},
        Mobile: {type: ['string', 'null'], maxLength: 40},
        ReferralStatus: {type: ['string', 'null'], maxLength: 100},
        Fax: {type: ['string', 'null'], maxLength: 40},

        referralStatusId: {type: ['integer', 'null']},
        ReferralCity: {type: ['string', 'null'], maxLength: 30},
        ReferralState: {type: ['string', 'null'], maxLength: 2},
        ReferralZip: {type: ['string', 'null'], maxLength: 9},
        referralTypeID: {type: ['integer', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ReferredbyModel;
