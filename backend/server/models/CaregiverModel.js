const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class Caregiver extends BaseModel {
  static idColumn = 'SocialSecurityNum';

  static get tableName() {
    return 'dbo.employee';
  }

  static get jsonSchema() {
    return {
      // required: ['firstName', 'lastName'],
      properties: {
        SocialSecurityNum: {type: 'string', maxLength: 9},
        FirstName: {type: ['string', 'null'], maxLength: 50},
        LastName: {type: ['string', 'null'], maxLength: 50},
        MiddleInit: {type: ['string', 'null'], maxLength: 1},

        Address1: {type: ['string', 'null'], maxLength: 80},
        Address2: {type: ['string', 'null'], maxLength: 80},
        City: {type: ['string', 'null'], maxLength: 30},
        County: {type: ['string', 'null'], maxLength: 20},
        State: {type: ['string', 'null'], maxLength: 3},
        Zip: {type: ['string', 'null'], maxLength: 9},
        lat: {type: ['float', 'null']},
        lng: {type: ['float', 'null']},
        addressHash: {type: ['string', 'null'], maxLength: 50},

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
        Phone1Formatted: {type: ['string', 'null'], maxLength: 21},
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
        lastUpdated: {type: ['string', 'null']}

        // [SocialSecurityNum] [varchar](9) NOT NULL,
        // [LastName] [varchar](50) NOT NULL,
        // [FirstName] [varchar](50) NULL,
        // [MiddleInit] [char](1) NULL,
        // [Address1] [varchar](40) NULL,
        // [Address2] [varchar](40) NULL,
        // [City] [varchar](30) NULL,
        // [County] [varchar](20) NULL,
        // [State] [char](3) NULL,
        // [Zip] [varchar](9) NULL,
        // [ValidDriversLicense] [bit] NOT NULL,
        // [Smoker] [bit] NOT NULL,
        // [WeightRestriction] [bit] NOT NULL,
        // [WeightLimit] [smallint] NULL,
        // [ClassificationID] [int] NULL,
        // [DateofBirth] [datetime] NULL,
        // [Status] [char](1) NOT NULL,
        // [StatusDate] [datetime] NULL,
        // [InactiveDate] [datetime] NULL,
        // [Email] [varchar](50) NULL,
        // [QuickBooksId] [varchar](30) NULL,
        // [CertExpirationDate] [datetime] NULL,
        // [Certification] [varchar](50) NULL,
        // [payOvertime] [bit] NOT NULL,
        // [CreateQbTSheets] [bit] NOT NULL,
        // [Phone1] [varchar](21) NULL,
        // [Phone2] [varchar](21) NULL,
        // [BackgroundCheck] [bit] NULL,
        // [className] [varchar](200) NULL,
        // [notes] [text] NULL,
        // [createdBy] [varchar](15) NULL,
        // [created] [datetime] NULL,
        // [updatedBy] [varchar](15) NULL,
        // [lastUpdated] [datetime] NULL,
        // [independentContractor] [bit] NULL,
        // [telephonyID] [varchar](9) NULL,
        // [doNotRehire] [bit] NULL,
        // [paychexID] [varchar](12) NULL,
        // [NPI] [varchar](10) NULL,
        // [int_statusid] [tinyint] NULL,
        // [str_reason] [varchar](25) NULL,
        // [str_Gender] [char](1) NULL,
        // [MessageID] [int] NULL
      }
    };
  }
}

module.exports = Caregiver;
