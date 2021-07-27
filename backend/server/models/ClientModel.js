const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class Client extends BaseModel {
  static idColumn = 'ClientId';

  static get tableName() {
    return 'dbo.client';
  }

  static get jsonSchema() {
    return {
      // required: ['firstName', 'lastName'],
      properties: {
        ClientId: {type: 'integer'},
        FirstName: {type: ['string', 'null'], maxLength: 25},
        LastName: {type: ['string', 'null'], maxLength: 25},
        MiddleInit: {type: ['string', 'null'], maxLength: 1},
        DateOfBirth: {type: ['string', 'null']},
        Weight: {type: ['integer', 'null']},

        Address1: {type: ['string', 'null'], maxLength: 80},
        Address2: {type: ['string', 'null'], maxLength: 80},
        City: {type: ['string', 'null'], maxLength: 30},
        County: {type: ['string', 'null'], maxLength: 20},
        State: {type: ['string', 'null'], maxLength: 3},
        Zip: {type: ['string', 'null'], maxLength: 9},
        lat: {type: ['float', 'null']},
        lng: {type: ['float', 'null']},
        addressHash: {type: ['string', 'null'], maxLength: 50},

        CaseManagerId: {type: ['integer', 'null']},

        Ambulatory: {type: ['string', 'null'], maxLength: 50},
        PrimaryDiagnosis: {type: ['string', 'null'], maxLength: 250},

        ReferredBy: {type: ['integer', 'null']},

        Status: {type: ['string', 'null'], maxLength: 1},

        PayorId: {type: ['integer', 'null']},

        Priority: {type: ['string', 'null'], maxLength: 50},
        Gender: {type: ['string', 'null'], maxLength: 1},
        QuickbooksId: {type: ['string', 'null'], maxLength: 30},

        ServiceStartDate: {type: ['string', 'null']},
        ServiceEndDate: {type: ['string', 'null']},

        ReferralNumber: {type: ['string', 'null'], maxLength: 20},
        Physician: {type: ['string', 'null'], maxLength: 255},
        PhysicianPhone: {type: ['string', 'null'], maxLength: 21},
        Phone: {type: ['string', 'null'], maxLength: 21},
        'MedicalRecord#': {type: ['string', 'null'], maxLength: 50},

        clientTypeID: {type: ['integer', 'null']},

        notes: {type: ['string', 'null']},
        ssn: {type: ['string', 'null'], maxLength: 9},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']},

        diagnosisCode: {type: ['string', 'null'], maxLength: 10},
        locationID: {type: ['string', 'null'], maxLength: 3},

        enable1500: {type: ['boolean', 'null']},

        telephonyID: {type: ['string', 'null'], maxLength: 10},

        gstExempt: {type: ['boolean', 'null']},
        DonotConfirm: {type: ['boolean', 'null']},
        int_statusid: {type: ['integer', 'null']},

        str_reason: {type: ['string', 'null'], maxLength: 25},

        RefNumber: {type: ['integer', 'null']},
        bit_Alert: {type: ['boolean']},

        Email: {type: ['string', 'null'], maxLength: 8000}

        // [ClientId] [int] IDENTITY(1,1) NOT NULL,
        // [FirstName] [varchar](25) NULL,
        // [LastName] [varchar](25) NULL,
        // [MiddleInit] [varchar](1) NULL,
        // [DateOfBirth] [datetime] NULL,
        // [Weight] [smallint] NULL,
        // [Address1] [varchar](80) NULL,
        // [Address2] [varchar](80) NULL,
        // [City] [varchar](30) NULL,
        // [County] [varchar](20) NULL,
        // [State] [varchar](3) NULL,
        // [Zip] [varchar](9) NULL,
        // [CaseManagerId] [int] NULL,
        // [Ambulatory] [varchar](50) NULL,
        // [PrimaryDiagnosis] [varchar](250) NULL,
        // [ReferredBy] [int] NULL,
        // [Status] [char](1) NULL,
        // [PayorId] [int] NULL,
        // [Priority] [varchar](50) NULL,
        // [Gender] [char](1) NULL,
        // [QuickbooksId] [varchar](30) NULL,
        // [ServiceStartDate] [datetime] NULL,
        // [ServiceEndDate] [datetime] NULL,
        // [ReferralNumber] [varchar](20) NULL,
        // [Physician] [varchar](255) NULL,
        // [DNR] [bit] NOT NULL,
        // [PhysicianPhone] [varchar](21) NULL,
        // [Phone] [varchar](21) NULL,
        // [MedicalRecord#] [varchar](50) NULL,
        // [clientTypeID] [int] NULL,
        // [notes] [text] NULL,
        // [ssn] [varchar](9) NULL,
        // [createdBy] [varchar](15) NULL,
        // [created] [datetime] NULL,
        // [updatedBy] [varchar](15) NULL,
        // [lastUpdated] [datetime] NULL,
        // [diagnosisCode] [varchar](10) NULL,
        // [locationID] [varchar](3) NULL,
        // [enable1500] [bit] NULL,
        // [telephonyID] [varchar](10) NULL,
        // [gstExempt] [bit] NULL,
        // [DonotConfirm] [bit] NULL,
        // [int_statusid] [tinyint] NULL,
        // [str_reason] [varchar](25) NULL,
        // [RefNumber] [int] NULL,
        // [bit_Alert] [bit] NOT NULL,
        // [Email] [varchar](8000) NULL
      }
    };
  }

  // static get relationMappings() {
  //   return {
  //     company: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: Company,
  //       join: {
  //         from: 'persons.companyId',
  //         to: 'companies.id'
  //       }
  //     },
  //     tags: {
  //       relation: Model.HasManyRelation,
  //       modelClass: Tag,
  //       join: {
  //         from: 'persons.id',
  //         to: 'tags.personId'
  //       }
  //     }
  //   };
  // }
}

module.exports = Client;
