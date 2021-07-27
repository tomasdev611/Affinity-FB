const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

// Deprecated: Should be removed
/**
 *
 */
class CalenderModel {
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  readByMonth(clientID, socialSecNum, division_db, token, calendarTime, type) {
    //calendarTime, type
    if (
      (clientID == undefined || clientID == '' || clientID == ' ') &&
      (socialSecNum == undefined || socialSecNum == '' || socialSecNum == ' ')
    ) {
      return false;
    }

    var currentDate;
    var duration;

    var calDate = new Date(calendarTime);

    var calStartDate = new Date(calendarTime);
    var calEndDate = new Date(calendarTime);

    var calWeekDay = calDate.getDay();
    var calMonthDay = calDate.getDate();
    var calMonth = calDate.getMonth();
    var calYear = calDate.getFullYear();

    if (type == 'month') {
      //calculate the last day of the month
      var lastDay = new Date(calYear, calMonth + 1, 0).getDate();
      duration = lastDay;

      //now setup the current date to be the last date of the month so we can fetch the whole month record
      //calDate.setDate(lastDay);

      //setup the start and end date
      calStartDate.setDate(1);
      calEndDate.setDate(lastDay + 1);
    } else if (type == 'week') {
      //get the number of days left in week
      var dayLeftWeek = 6 - calWeekDay; //starts with 0

      duration = 7;
      calDate.setDate(dayLeftWeek + calMonthDay);

      calStartDate.setDate(dayLeftWeek + calMonthDay - 6); //start of the week
      calEndDate.setDate(dayLeftWeek + calMonthDay + 1); //end of the week

      //get the number of days left in week
      // var dayLeftWeek = 6 - calWeekDay; //starts with 0

      calDate.setDate(calMonthDay);

      calStartDate.setDate(calMonthDay); //start of the week
      calEndDate.setDate(calMonthDay + 1); //end of the week
    }

    currentDate = calDate.toISOString().substring(0, 10);
    calStartDate = calStartDate.toISOString().substring(0, 10);
    calEndDate = calEndDate.toISOString().substring(0, 10);

    const self = this;
    const deferred = Q.defer();
    var sql = '';

    sql = `use [${division_db}];select dbo.schedules.*,dbo.employee.FirstName as careGiverFirstName,dbo.employee.LastName as careGiverLastName, dbo.client.FirstName,dbo.client.LastName ,dbo.services.Description  from dbo.schedules INNER JOIN dbo.client ON dbo.schedules.ClientId=dbo.client.ClientId INNER JOIN dbo.employee ON dbo.schedules.SocialSecNum=dbo.employee.SocialSecurityNum INNER JOIN dbo.services ON dbo.schedules.ServiceCode=dbo.services.ServiceCode
        where (CONVERT(datetime,StartTime) >= '${calStartDate}' OR  CONVERT(datetime,EndTime) >= '${calStartDate}') AND (CONVERT(datetime,StartTime) <= '${calEndDate}' OR  CONVERT(datetime,EndTime) <= '${calEndDate}')`;

    // sql = `use [${division_db}];select dbo.schedules.*,dbo.employee.FirstName as careGiverFirstName,dbo.employee.LastName as careGiverLastName, dbo.client.FirstName,dbo.client.LastName ,dbo.services.Description  from dbo.schedules INNER JOIN dbo.client ON dbo.schedules.ClientId=dbo.client.ClientId INNER JOIN dbo.employee ON dbo.schedules.SocialSecNum=dbo.employee.SocialSecurityNum INNER JOIN dbo.services ON dbo.schedules.ServiceCode=dbo.services.ServiceCode
    //  where (StartTime >= '${calStartDate}' OR  EndTime >= '${calStartDate}') AND (StartTime <= '${calEndDate}' OR  EndTime <= '${calEndDate}')`;

    // sql = `use [${division_db}];select dbo.schedules.*,dbo.employee.FirstName as careGiverFirstName,dbo.employee.LastName as careGiverLastName, dbo.client.FirstName,dbo.client.LastName ,dbo.services.Description  from dbo.schedules INNER JOIN dbo.client ON dbo.schedules.ClientId=dbo.client.ClientId INNER JOIN dbo.employee ON dbo.schedules.SocialSecNum=dbo.employee.SocialSecurityNum INNER JOIN dbo.services ON dbo.schedules.ServiceCode=dbo.services.ServiceCode where ( (StartTime >= dateadd(day, 1-datepart(dw, '${currentDate}'), CONVERT(datetime,'${currentDate}'))
    // AND StartTime <  dateadd(day, ${duration}-datepart(dw, '${currentDate}'), CONVERT(datetime,'${currentDate}')) ) OR (EndTime >= dateadd(day, 1-datepart(dw, '${currentDate}'), CONVERT(datetime,'${currentDate}'))
    // AND EndTime <  dateadd(day, ${duration}-datepart(dw, '${currentDate}'), CONVERT(datetime,'${currentDate}')) ) )`;
    if (clientID !== ' ') {
      sql += ` and dbo.schedules.ClientId = ` + clientID;
    }
    if (socialSecNum !== ' ') {
      sql += ` and dbo.schedules.SocialSecNum = ` + socialSecNum;
    }

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  readByMonthOld(month, year, clientID, socialSecNum, division_db, token) {
    if (
      (clientID == undefined || clientID == '' || clientID == ' ') &&
      (socialSecNum == undefined || socialSecNum == '' || socialSecNum == ' ')
    ) {
      return false;
    }
    const self = this;
    const deferred = Q.defer();
    var sql = '';
    sql =
      `use [${division_db}];select dbo.schedules.*,dbo.employee.FirstName as careGiverFirstName,dbo.employee.LastName as careGiverLastName, dbo.client.FirstName,dbo.client.LastName ,dbo.services.Description  from dbo.schedules INNER JOIN dbo.client ON dbo.schedules.ClientId=dbo.client.ClientId INNER JOIN dbo.employee ON dbo.schedules.SocialSecNum=dbo.employee.SocialSecurityNum INNER JOIN dbo.services ON dbo.schedules.ServiceCode=dbo.services.ServiceCode where MONTH([Date])=` +
      month +
      ` and YEAR([Date])=` +
      year;
    if (clientID !== ' ') {
      sql += ` and dbo.schedules.ClientId = ` + clientID;
    }
    if (socialSecNum !== ' ') {
      sql += ` and dbo.schedules.SocialSecNum = ` + socialSecNum;
    }

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  addEvent(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    if (params.ServiceCode == '') {
      params.ServiceCode = 1;
    }
    // var currentDate = new Date().toLocaleDateString('US');
    var currentDate = params.StartTime.substring(0, 10);
    currentDate = currentDate + ' ' + '00:00:00';
    //const sql = `select * from  dbo.rw_caregivers where id='${id}' `;
    var sql = `use [${division_db}];insert into  dbo.schedules(SocialSecNum,ClientId,StartTime,EndTime,Date,ServiceCode,ServiceRequestId,itemName) values('${
      params.SocialSecNum
    }','${params.ClientId}','${params.StartTime}','${params.EndTime}','${currentDate}',${
      params.ServiceCode
    },${params.ServiceRequestId},'${params.itemName}')`;

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.error('ERROR', err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  editEvent(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //var currentDate = new Date().toLocaleDateString('US');
    var currentDate = params.NewStartTime.substring(0, 10);
    currentDate = currentDate + ' ' + '00:00:00';
    var serviceRequestId = '';
    params.ServiceRequestId == undefined
      ? (serviceRequestId = null)
      : (serviceRequestId = params.serviceRequestId);
    //const sql = `select * from  dbo.rw_caregivers where id='${id}' `;
    var sql = `use [${division_db}];update  dbo.schedules set SocialSecNum='${
      params.NewCaregiverSSN
    }',ClientId=${params.ClientId},StartTime='${params.NewStartTime}',EndTime='${
      params.NewEndTime
    }',Date='${currentDate}',ServiceCode='${params.ServiceCode}',ServiceRequestId=${
      params.ServiceRequestId
    },itemName='${params.payroll ? params.payroll : ''}' where SocialSecNum='${
      params.SocialSecNum
    }' and ClientId='${params.ClientId}' and StartTime='${params.StartTime}' and EndTime='${
      params.EndTime
    }' `;

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve({
          data: sql,
          status: true
        });
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(sql);
      });
    return deferred.promise;
  }

  updateEvent(scheduleId, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    // var currentDate = new Date().toLocaleDateString('US');
    var currentDate = params.StartTime.substring(0, 10);
    currentDate = currentDate + ' ' + '00:00:00';
    //const sql = `select * from  dbo.rw_caregivers where id='${id}' `;
    var sql = `use [${division_db}];update  dbo.schedules set SocialSecNum='${
      params.SocialSecNum
    }',ClientId=${params.ClientId},StartTime='${params.StartTime}',EndTime='${
      params.EndTime
    }',Date='${currentDate}',ServiceCode=${params.ServiceCode},ServiceRequestId=${
      params.ServiceRequestId
    },itemName='${params.itemName}' where scheduleID=${scheduleId}`;

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  readByWeek(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //const sql = `select * from  dbo.rw_caregivers where id='${id}' `;
    var sql =
      `use [${division_db}];select dbo.schedules.*,dbo.employee.FirstName as careGiverFirstName, dbo.employee.LastName as careGiverLastName,  dbo.client.FirstName, dbo.client.LastName  from  dbo.schedules INNER JOIN  dbo.client ON  dbo.schedules.ClientId= dbo.client.ClientId INNER JOIN  dbo.employee ON  dbo.schedules.SocialSecNum= dbo.employee.SocialSecurityNum where StartTime>=` +
      params.startDate.replace(/"/g, "'") +
      ` and EndTime <=` +
      params.endDate.replace(/"/g, "'");
    if (params.ClientId != undefined) {
      sql += ` and  dbo.schedules.ClientId=` + params.ClientId;
    }
    if (params.ssn != undefined) {
      sql += ` and  dbo.schedules.SocialSecNum=` + params.ssn;
    }
    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  readByDay(day, month, year, clientID, socialSecNum, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //const sql = `select * from  dbo.rw_caregivers where id='${id}' `;
    var sql =
      `use [${division_db}];select  dbo.schedules.*, dbo.employee.FirstName as careGiverFirstName, dbo.employee.LastName as careGiverLastName,  dbo.client.FirstName, dbo.client.LastName  from  dbo.schedules INNER JOIN  dbo.client ON  dbo.schedules.ClientId= dbo.client.ClientId INNER JOIN  dbo.employee ON  dbo.schedules.SocialSecNum= dbo.employee.SocialSecurityNum where  DAY([Date])=` +
      day +
      ` and MONTH([Date])=` +
      month +
      ` and YEAR([Date])=` +
      year;

    if (clientID != undefined || clientID != '') {
      sql += ` and  dbo.schedules.ClientId=` + clientID;
    }
    if (socialSecNum != undefined || socialSecNum != '') {
      sql += ` and  dbo.schedules.SocialSecNum=` + socialSecNum;
    }

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  deleteEvent(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();

    if (params.SocialSecNum == 'undefined' || params.SocialSecNum == '') {
      var sql = `use [${division_db}];delete from  dbo.schedules where ClientId=${
        params.ClientId
      } and StartTime between '${params.StartTime}' and '${params.EndTime}' and EndTime between '${
        params.StartTime
      }' and '${params.EndTime}' `;

      var sql = `use [${division_db}];delete from  dbo.schedules where SocialSecNum='${
        params.SocialSecNum
      }' and ClientId=${params.ClientId} and StartTime between '${params.StartTime}' and '${
        params.EndTime
      }' and EndTime between '${params.StartTime}' and '${params.EndTime}' `;
    }
    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve({
          data: sql,
          status: true
        });
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }
}
module.exports = CalenderModel;
