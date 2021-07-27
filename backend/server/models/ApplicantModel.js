const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class Applicant extends BaseModel {
  static idColumn = 'SocialSecurityNum';

  static get tableName() {
    return 'dbo.Applicant';
  }

  static get jsonSchema() {
    return {
      // required: ['firstName', 'lastName'],
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
        FirstName: {type: ['string', 'null'], maxLength: 50},
        LastName: {type: ['string', 'null'], maxLength: 50},
        MiddleInit: {type: ['string', 'null'], maxLength: 1},

        Address1: {type: ['string', 'null'], maxLength: 40}, // Length different
        Address2: {type: ['string', 'null'], maxLength: 40}, // Length different
        City: {type: ['string', 'null'], maxLength: 30},
        County: {type: ['string', 'null'], maxLength: 20},
        State: {type: ['string', 'null'], maxLength: 3},
        Zip: {type: ['string', 'null'], maxLength: 9},
        // lat: {type: ['float', 'null']}, // Missing in Applicant
        // lng: {type: ['float', 'null']}, // Missing in Applicant
        // addressHash: {type: ['string', 'null'], maxLength: 50}, // Missing in Applicant

        photo: {type: ['string', 'null'], maxLength: 200},

        ValidDriversLicense: {type: ['boolean']},
        Smoker: {type: ['boolean']},
        WeightRestriction: {type: ['boolean']},
        WeightLimit: {type: ['integer', 'null']},
        ClassificationID: {type: ['integer', 'null']},

        DateofBirth: {type: ['string', 'null']},
        Status: {type: ['string', 'null'], maxLength: 1},
        StatusDate: {type: ['string', 'null']},
        InactiveDate: {type: ['string', 'null']},
        Email: {type: ['string', 'null'], maxLength: 50},
        QuickbooksId: {type: ['string', 'null'], maxLength: 3},
        CertExpirationDate: {type: ['string', 'null']},
        Certification: {type: ['string', 'null'], maxLength: 50},

        payOvertime: {type: ['boolean']},
        CreateQbTSheets: {type: ['boolean']},

        Phone1: {type: ['string', 'null'], maxLength: 21},
        // Phone1Formatted: {type: ['string', 'null'], maxLength: 21}, // Missing in Applicant
        Phone2: {type: ['string', 'null'], maxLength: 21},

        BackgroundCheck: {type: ['boolean']},
        className: {type: ['string', 'null'], maxLength: 200},
        notes: {type: ['string', 'null']},

        independentContractor: {type: ['boolean']},

        telephonyID: {type: ['string', 'null'], maxLength: 9},

        doNotRehire: {type: ['boolean']},

        paychexID: {type: ['string', 'null'], maxLength: 12},
        NPI: {type: ['string', 'null'], maxLength: 10},
        int_statusid: {type: ['integer', 'null']},

        str_reason: {type: ['string', 'null'], maxLength: 25},
        str_Gender: {type: ['string', 'null'], maxLength: 1},

        MessageID: {type: ['integer', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']},

        TextMessage: {type: ['string', 'null'], maxLength: 50},
        UnknownSSN: {type: ['boolean', 'null']} // Not in Employee
      }
    };
  }
}

module.exports = Applicant;
