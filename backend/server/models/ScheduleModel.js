const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class ScheduleModel extends BaseModel {
  static idColumn = 'scheduleID';
  static columnsForFetch = ['description', 'caregivers', 'client'];

  static get tableName() {
    return 'dbo.schedules';
  }

  static get jsonSchema() {
    return {
      properties: {
        SocialSecNum: {type: 'string', maxLength: 9},
        ClientId: {type: 'integer'},
        Date: {type: ['string', 'null']},
        StartTime: {type: ['string', 'null']},
        EndTime: {type: ['string', 'null']},

        ServiceCode: {type: ['integer', 'null']},
        IsConfirmed: {type: ['boolean', 'null']},

        serviceRequestId: {type: ['integer', 'null']},
        itemName: {type: ['string', 'null'], maxLength: 31},

        notes: {type: ['string', 'null'], maxLength: 1000},
        scheduleID: {type: 'integer'},
        timematch: {type: ['boolean', 'null']},
        int_missedstatus: {type: ['integer', 'null']},

        createdBy: {type: ['string', 'null'], maxLength: 15},
        created: {type: ['string', 'null']},
        updatedBy: {type: ['string', 'null'], maxLength: 15},
        lastUpdated: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = ScheduleModel;
