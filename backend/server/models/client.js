const Q = require('q');
const sql = require('mssql');
const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');
const database = require('./../lib/databasemssql');
const Client = require('./ClientModel');
const ClientReminder = require('./ClientReminder');
/**
 *
 */
class ClientModel {
  /**
   *
   * @param {*} logger
   */
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * Read Client By Id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  readById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    // const sql = `use [${division_db}] ; select dbo.client.*,dbo.physician.*,dbo.Referredby.*,dbo.payor.*  from dbo.client INNER JOIN dbo.physician ON dbo.client.Physician=dbo.physician.PhysicianName INNER JOIN dbo.Referredby ON dbo.client.ReferredBy=dbo.Referredby.ReferredById INNER JOIN dbo.payor ON dbo.client.PayorId=dbo.payor.PayorId  where ClientId='${id}' `;

    const sql = `use [${division_db}] ; select * from dbo.client where ClientId='${id}'`;

    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset[0]);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   *
   */
  read(params, division_db, token, query) {
    const self = this;
    var type = '';
    if (query.type == 'active') {
      type = " where dbo.client.status='A' ";
    }
    if (query.type == 'inactive') {
      type = " where dbo.client.status='I' ";
    }
    const deferred = Q.defer();
    // const sql =
    //   `use [${division_db}]; select dbo.client.*,dbo.physician.PhysicianName,dbo.Referredby.Name as ReferredByName,dbo.ClientType.Name as ClientTypeName,
    //     dbo.casemanager.FirstName +  ' ' + dbo.casemanager.LastName  as CaseManagerName, str_reason as Reason,enable1500 as Enable1500,
    //     locationID as LocationID,ssn as SSN,telephonyID as TelophonyID,MiddleInit as MiddleInitial
    //     from dbo.client
    //     LEFT JOIN dbo.physician ON dbo.client.Physician=dbo.physician.PhysicianName
    //     LEFT JOIN dbo.Referredby ON dbo.client.ReferredBy=dbo.Referredby.ReferredById
    //     LEFT JOIN dbo.ClientType ON dbo.client.clientTypeId=dbo.ClientType.clientTypeId
    //     LEFT JOIN dbo.casemanager ON dbo.client.CaseManagerId=dbo.casemanager.CaseManagerId
    //     LEFT JOIN dbo.payor ON dbo.client.PayorId=dbo.payor.PayorId
    //     ` +
    //   type +
    //   `
    //     ORDER BY ClientId desc
    //     `;
    const sql =
      `use [${division_db}]; select dbo.client.* from dbo.client
        ` +
      type +
      `
        ORDER BY ClientId desc
        `;

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

  /**
   *
   */
  readWithAssignedHours(division_db, token, calendarTime, type) {
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
      calStartDate.setDate(1 + 1);
      calEndDate.setDate(lastDay + 1);
    } else if (type == 'week') {
      //get the number of days left in week
      var dayLeftWeek = 6 - calWeekDay; //starts with 0

      duration = 7;
      calDate.setDate(dayLeftWeek + calMonthDay);

      calStartDate.setDate(dayLeftWeek + calMonthDay - 6 + 1); //start of the week
      // add + 2 will get correctly for 7 days, else it get for 6 days, bug fix on 7 dec 2018
      calEndDate.setDate(dayLeftWeek + calMonthDay + 2); //end of the week
    } else {
      calDate.setDate(calMonthDay);

      calStartDate.setDate(calMonthDay); //start of the week
      calEndDate.setDate(calMonthDay + 1); //end of the week
    }

    currentDate = calDate.toISOString().substring(0, 10);
    calStartDate = calStartDate.toISOString().substring(0, 10);
    calEndDate = calEndDate.toISOString().substring(0, 10);

    const self = this;
    const deferred = Q.defer();

    const sql = `use [${division_db}] ; With  customSchedule as ( SELECT ClientId,StartTime,EndTime,
            ISNULL(ABS(DATEDIFF(MINUTE,StartTime,EndTime)), 0) as TotalTime
            FROM dbo.schedules where (CONVERT(datetime,StartTime) >= '${calStartDate}' OR
            CONVERT(datetime,EndTime) >= '${calStartDate}') AND (CONVERT(datetime,StartTime) <= '${calEndDate}'
            OR  CONVERT(datetime,EndTime) <= '${calEndDate}') )
       select dbo.client.ClientId,FirstName,LastName ,cast(SUM(ROUND((TotalTime*1.0/60),2)) as decimal(10,1)) as total_hours
       from customSchedule RIGHT JOIN dbo.client ON dbo.client.ClientId = customSchedule.ClientId
       where dbo.client.str_reason='ACTIVE' GROUP BY dbo.client.ClientId,FirstName,LastName
       order by FirstName `;

    //         const sql = `use [${division_db}] ; With  customSchedule as ( SELECT ClientId,StartTime,EndTime,
    //      ISNULL(ABS(DATEDIFF(HOUR,StartTime,EndTime)), 0) as TotalTime FROM dbo.schedules WHERE (StartTime >= dateadd(day, 1-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}'))
    // AND StartTime <  dateadd(day, ${duration}-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}')) ) OR (EndTime >= dateadd(day, 1-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}'))
    // AND EndTime <  dateadd(day, ${duration}-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}')) ) )
    // select dbo.client.ClientId,FirstName,LastName ,SUM(TotalTime) as total_hours from customSchedule RIGHT JOIN dbo.client ON dbo.client.ClientId = customSchedule.ClientId GROUP BY dbo.client.ClientId,FirstName,LastName order by FirstName `;

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
  // readWithAssignedHours(division_db, token) {
  //     const self = this;
  //     const deferred = Q.defer();
  //     const sql = `use [${division_db}] ; With  customSchedule as ( SELECT  dbo.schedules.ClientId,StartTime,EndTime,
  //          ISNULL(DATEDIFF(HOUR,StartTime,EndTime), 0) as TotalTime FROM dbo.schedules WHERE (StartTime >= dateadd(day, 1-datepart(dw, getdate()), CONVERT(date,getdate()))
  //     AND StartTime <  dateadd(day, 7-datepart(dw, getdate()), CONVERT(date,getdate())) ) OR (EndTime >= dateadd(day, 1-datepart(dw, getdate()), CONVERT(date,getdate()))
  //     AND EndTime <  dateadd(day, 7-datepart(dw, getdate()), CONVERT(date,getdate())) ) )
  //     select dbo.client.ClientId,FirstName,LastName ,SUM(TotalTime) as total_hours from customSchedule RIGHT JOIN dbo.client ON dbo.client.ClientId = customSchedule.ClientId GROUP BY dbo.client.ClientId,FirstName,LastName order by FirstName `;
  //     self.db.request().query(sql)
  //         .then((result) => {
  //             deferred.resolve(result.recordset);
  //         })
  //         .catch((err) => {
  //             console.trace(err); // todo : will do to logger later
  //             deferred.reject(err);
  //         });
  //     return deferred.promise;
  // }

  /**
   *
   */
  getCustomFields(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //Todo put condition to fetch only the column which are active
    const sql = `SET ARITHABORT ON;

         use [${division_db}] ; DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX) SET @cols = STUFF((SELECT distinct ',' + QUOTENAME(cfieldName)
        FROM dbo.ClientCustomFields c
        FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)')
    ,1,1,'')
    set @query = 'SELECT ClientId, ' + @cols + ' from
        (
            select ClientId
                , descr
                , cfieldName
            from dbo.ClientCustomFields
       ) x
        pivot
        (
             max(descr)
            for cfieldName in (' + @cols + ')
        ) p '
execute(@query)
         `;
    self.db
      .request()
      .query(sql)
      .then(result => {
        //run another query to find all active columns
        const sqlColumns = `use [${division_db}] ; SELECT cfieldName FROM dbo.CustomFields WHERE status=1 AND showClient=1 ORDER BY created DESC`;

        self.db
          .request()
          .query(sqlColumns)
          .then(resultFields => {
            let columns = [];
            for (let k = 0; k < resultFields.recordset.length; k++) {
              columns.push(resultFields.recordset[k].cfieldName);
            }

            for (let m = 0; m < result.recordset.length; m++) {
              let row = result.recordset[m];
              for (var key in result.recordset[m]) {
                if (key != 'ClientId' && columns.indexOf(key) < 0) {
                  delete row[key];
                } else {
                }
              }

              result.recordset[m] = row;
            }
            //loop through the result set to remove all the non
            deferred.resolve({
              data: result.recordset,
              status: true
            });
          })
          .catch(err => {
            console.trace(err); // todo : will do to logger later
            deferred.reject(err);
          });
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Read caregiver by Id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve caregiver record.
   */
  getVisitHistory(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let current_date = new Date().toLocaleDateString('en-US');
    //const sql = `select * from dbo.rw_caregivers where id='${id}' `;
    //const sql = `use [${division_db}] ; SELECT COUNT(dbo.Visits.socSecNum) as total_visits,MIN(dbo.Visits.visitDate) as first_visit,MAX(dbo.Visits.visitDate) as last_visit, dbo.Visits.socSecNum,dbo.employee.FirstName,dbo.employee.LastName FROM dbo.Visits INNER JOIN dbo.employee ON dbo.Visits.socSecNum = dbo.employee.SocialSecurityNum  WHERE dbo.Visits.clientID='${id}' GROUP BY dbo.Visits.socSecNum,dbo.employee.FirstName,dbo.employee.LastName`;
    const sql = `use [${division_db}] ; SELECT COUNT(dbo.schedules.SocialSecNum) as total_visits,MIN(dbo.schedules.EndTime) as first_visit,
        MAX(dbo.schedules.EndTime) as last_visit, dbo.schedules.SocialSecNum,dbo.employee.FirstName,dbo.employee.
        LastName FROM dbo.schedules INNER JOIN dbo.employee ON dbo.schedules.SocialSecNum = dbo.employee.SocialSecurityNum
          WHERE dbo.schedules.ClientId='${id}' and dbo.schedules.EndTime < '${current_date}' GROUP BY dbo.schedules.SocialSecNum,dbo.employee.FirstName,dbo.employee.LastName`;
    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.trace(sql); // todo : will do to logger later
        deferred.reject(sql);
      });
    return deferred.promise;
  }

  getMyInitialContact(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ; select * from dbo.InitialContact where InitialContactID='${id}' `;
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
  /**
   * get attachement by id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  attachmentById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ; select * from dbo.clientAttachments where clientId='${id}' ORDER BY attachmentId DESC`;
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

  /**
   * get attachement by id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  contactsById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ; select * from dbo.contacts where clientId='${id}' ORDER BY created DESC `;
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

  /**
   * get attachement by id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  reminderById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ; select * from dbo.clientReminders where clientId='${id}' ORDER BY created DESC`;
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

  /**
   *     for add new client
   * @param {*} params
   */
  createClient(params, division_db) {
    const self = this;
    const deferred = Q.defer();
    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        if (params[p] == 'undefined' || params[p] == undefined || params[p] == 'Invalid Date') {
          params[p] = '';
        }
      }
    }

    let sqlField = `use [${division_db}]; insert into dbo.client (LastName,FirstName,MiddleInit,
      ServiceStartDate,DateofBirth,Status,ServiceEndDate,Email,Ambulatory,RefNumber,
      Phone,clientTypeID,createdBy,created,updatedBy,lastUpdated,
      diagnosisCode,Priority,ssn,telephonyID,Gender,AccountingID,
      profile_url,Address1,Address2,City,County,State,Zip,str_reason`;

    let sqlValues = `
                        VALUES(
                        '${params.LastName}',
                        '${params.FirstName}',
                        '${params.MiddleInit}',
                        '${params.ServiceStartDate}',
                        '${params.DateOfBirth}',
                        '${params.Status}',
                        '${params.ServiceEndDate}',
                        '${params.Email}',
                        '${params.Ambulatory}',
                        ${params.RefNumber},
                        '${params.Phone}',
                        ${params.clientTypeID},
                        '${params.createdBy}',
                        '${params.created}',
                        '${params.updatedBy}',
                        '${params.lastUpdated}',
                        '${params.diagnosisCode}',
                        '${params.Priority}',
                        '${params.ssn}',
                        '${params.telephonyID}',
                        '${params.Gender}',
                        '${params.AccountingID}',
                        '${params.profile_url}',
                        '${params.Address1}',
                        '${params.Address2}',
                        '${params.City}',
                        '${params.County}',
                        '${params.State}',
                        '${params.Zip}',
                        '${params.str_reason}'`;

    if (params.locationID != '') {
      sqlField = sqlField + `,locationID`;
      sqlValues = sqlValues + `,'${params.locationID}'`;
    }

    if (params.ReferredBy != '') {
      sqlField = sqlField + `,ReferredBy`;
      sqlValues = sqlValues + `,${params.ReferredBy}`;
    }

    if (params.ReferralNumber != '') {
      sqlField = sqlField + `,ReferralNumber`;
      sqlValues = sqlValues + `,${params.ReferralNumber}`;
    }

    if (params.CaseManagerId != '') {
      sqlField = sqlField + `,CaseManagerId`;
      sqlValues = sqlValues + `,${params.CaseManagerId}`;
    }
    if (params.InitialContactID != '') {
      sqlField = sqlField + `,InitialContactID`;
      sqlValues = sqlValues + `,${params.InitialContactID}`;
    }
    if (params.Weight != '') {
      sqlField = sqlField + `,Weight`;
      sqlValues = sqlValues + `,${params.Weight}`;
    }
    if (params.Physician != '') {
      // sqlField = sqlField + `,Physician`;
      //sqlValues = sqlValues + `,'${params.Physician}'`;
    }

    sqlField = sqlField + `)`;
    sqlValues = sqlValues + `)`;

    let sqlQuery = sqlField + sqlValues;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(sqlQuery);
      });
    return deferred.promise;
  }

  // /**
  //  *   for update client
  //  * @param {*} id
  //  * @param {*} params
  //  */
  // update(id, params, division_db) {
  //   const self = this;
  //   const deferred = Q.defer();
  //   for (var p in params) {
  //     if (params.hasOwnProperty(p)) {
  //       if (params[p] == 'undefined' || params[p] == undefined || params[p] == 'Invalid Date') {
  //         params[p] = '';
  //       }
  //     }
  //   }

  //   if (params.ReferredBy == '') {
  //     params.ReferredBy = null;
  //   }
  //   if (params.CaseManagerId == '') {
  //     params.CaseManagerId = null;
  //   }
  //   if (params.InitialContactID == '') {
  //     params.InitialContactID = null;
  //   }
  //   if (params.clientTypeID == '') {
  //     params.clientTypeID = null;
  //   }
  //   if (params.Weight == '') {
  //     params.Weight = 0;
  //   }
  //   if (params.Physician == '') {
  //     params.Physician = null;
  //   } else {
  //     params.Physician = "'" + params.Physician + "'";
  //   }
  //   if (params.locationID == '') {
  //     params.locationID = null;
  //   } else {
  //     params.locationID = "'" + params.locationID + "'";
  //   }
  //   const sqlQuery = `use [${division_db}] ; update dbo.client set
  //                           LastName='${params.LastName ? params.LastName : ''}',
  //                           FirstName='${params.FirstName ? params.FirstName : ''}',
  //                           MiddleInit='${params.MiddleInit ? params.MiddleInit : ''}',
  //                           Weight=${params.Weight},
  //                           ServiceStartDate='${params.ServiceStartDate}',
  //                           DateofBirth='${params.DateOfBirth}',
  //                           Status='${params.Status}',
  //                           ServiceEndDate='${params.ServiceEndDate}',
  //                           Email='${params.Email}',
  //                           CaseManagerId=${params.CaseManagerId},
  //                           Ambulatory='${params.Ambulatory}',
  //                           RefNumber='${params.RefNumber == undefined ? 0 : params.RefNumber}',
  //                           ReferralNumber='${params.ReferralNumber}',
  //                           Phone='${params.Phone}',
  //                           ReferredBy=${params.ReferredBy},
  //                           Physician=${params.Physician},
  //                           clientTypeID=${params.clientTypeID},
  //                           createdBy='${params.createdBy}',
  //                           updatedBy='${params.updatedBy}',
  //                           diagnosisCode='${params.diagnosisCode}',
  //                           Priority='${params.Priority}',
  //                           ssn='${params.ssn}',
  //                           telephonyID='${params.telephonyID}',
  //                           Gender='${params.Gender}',
  //                           AccountingID='${params.AccountingID}',
  //                           InitialContactID=${params.InitialContactID},
  //                           locationID=${params.locationID},
  //                           profile_url='${params.profile_url}',
  //                           Address1='${params.Address1}',
  //                           Address2='${params.Address2}',
  //                           City='${params.City}',
  //                           County='${params.County}',
  //                           State='${params.State}',
  //                           Zip='${params.Zip}',
  //                           str_reason='${params.str_reason}'
  //                       where ClientId=${id}`;
  //   self.db
  //     .request()
  //     .query(sqlQuery)
  //     .then(result => {
  //       deferred.resolve(result);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       deferred.reject(err);
  //     });
  //   return deferred.promise;
  // }

  /**
   *   for update client
   * @param {*} id
   * @param {*} params
   */
  async update(id, params, division_db) {
    for (var p in params) {
      if (params.hasOwnProperty(p)) {
        if (params[p] == 'undefined' || params[p] == 'Invalid Date') {
          params[p] = '';
        }
      }
    }

    // [
    //   'ReferredBy',
    //   'CaseManagerId',
    //   'InitialContactID',
    //   'clientTypeID',
    //   'Physician',
    //   'locationID',
    //   'PayorId'
    // ].forEach(field => {
    //   if (!params[field]) {
    //     params[field] = null;
    //   }
    // });

    // ['Weight', 'int_statusid'].forEach(field => {
    //   if (!params[field]) {
    //     params[field] = null;
    //   } else {
    //     params[field] = parseInt(params[field], 10);
    //   }
    // });
    const update = await Client.query()
      .update(params)
      .where('ClientId', parseInt(id, 10));
    return update;
  }

  /**
   *
   * @param {*} id
   */
  delete(param, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; update dbo.client set Status='P' where ClientId='${
      param.ClientId
    }'`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   *
   * @param {*} id
   */
  inactivate(param, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; update dbo.client set Status='I' where ClientId='${
      param.ClientId
    }'`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }
  /**
   *
   * @param {*} id
   */
  activate(param, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; update dbo.client set Status='A' where ClientId='${
      param.ClientId
    }'`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  insertInitialContact(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; insert into  dbo.InitialContact(Name,Address1,Address2,City,State,Zip,Relation,Email,Phone,createdBy,created,updatedBy,lastUpdated) values('${
      params.Name
    }','${params.Address1}','${params.Address2}','${params.City}','${params.State}','${
      params.Zip
    }',${params.Relation},'${params.Email}','${params.Phone}','${params.createdBy}','${
      params.created
    }','${params.updatedBy}','${params.lastUpdated}')`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        const sqlQuery = `use [${division_db}] ; SELECT MAX(InitialContactID) AS LastID FROM dbo.InitialContact`;
        self.db
          .request()
          .query(sqlQuery)
          .then(result => {
            var id = result.recordset[0].LastID;
            const sqlQuery = `use [${division_db}] ; update dbo.client set InitialContactID=${id} where ClientID=${
              params.ClientId
            }`;
            self.db
              .request()
              .query(sqlQuery)
              .then(result => {
                deferred.resolve({
                  data: result,
                  status: true
                });
              })
              .catch(err => {
                console.error(err);
                deferred.reject(err);
              });
          })
          .catch(err => {
            console.error(err);
            deferred.reject(err);
          });
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  updateInitialContact(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; update dbo.InitialContact set Name='${
      params.Name
    }',Address1='${params.Address1}',Address2='${params.Address2}',City='${params.City}',State='${
      params.State
    }',Zip='${params.Zip}',Relation='${params.Relation}',Email='${params.Email}',Phone='${
      params.Phone
    }',lastUpdated='${params.lastUpdated}' where Name='${params.x_Name}' and Relation='${
      params.x_Relation
    }' and Email='${params.x_Email}' and Phone='${params.x_Phone}' `;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  getRelations(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; select * from dbo.InitialContactRelation`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  insertPhone(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; insert into  dbo.contacts(ClientId,Name,ContactEmail,OtherContactInfo,Phone,Fax,createdBy) values(${
      params.ClientId
    },'${params.Name}','${params.Email}','${params.ContactDesrc}','${params.Phone}','${
      params.BuesinessPhone
    }','${params.createdBy}')`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  updatePhone(params, clientID, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ;update  dbo.contacts set ClientId=${
      params.ClientId
    },Name='${params.Name}',ContactEmail='${params.Email}',OtherContactInfo='${
      params.BuesinessPhone
    }',Phone='${params.Phone}' where ClientId=${clientID}`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  deleteContact(params, ContactID, clientID, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ;DELETE  dbo.contacts where ClientId=${clientID} and ContactID=${ContactID}`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  reminderDescription(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.Reminders where client=1 ORDER BY description asc`;
    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result.recordset);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  async insertRemind(knex, clientID, params) {
    const reminder = await ClientReminder.query(knex).insert({clientID, ...params});
    return reminder;
  }

  getReferredBy(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.Referredby`;
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

  getPayor(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.payor`;
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

  getPhysician(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.physician`;
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
  getCounty(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.switch_county`;
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

  getInitialContact(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.InitialContact`;
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
  getClientType(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.ClientType`;
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

  getCaseManager(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.casemanager`;
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

  insertAttachment(params, attachment, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    var ps = new sql.PreparedStatement(self.db);
    ps.input('attachment', sql.Image);
    ps.input('ClientId', sql.VarChar);
    ps.input('descr', sql.VarChar);
    ps.prepare(
      `use [${division_db}]; INSERT INTO dbo.clientAttachments(ClientId,descr,attachment) VALUES (@ClientId, @descr, @attachment)`,
      function(err) {
        if (err) {
          console.error(err);
          deferred.reject(err);
          return;
        }
        // check err
        ps.execute(
          {attachment: attachment, ClientId: params.ClientId, descr: params.descr},
          function(err, records) {
            // check err
            if (err) {
              console.error(err);
              deferred.reject(err);
              return;
            } else {
              deferred.resolve(records);
            }
            ps.unprepare(function(err) {
              if (err) {
                console.error(err);
                // deferred.reject(err);
              } else {
              }
              // check err
              // If no error, it's been inserted!
            });
          }
        );
      }
    );

    return deferred.promise;
  }

  updateAttachment(params, attachment, id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    var ps = new sql.PreparedStatement(self.db);
    let sqParams = {descr: params.descr};
    ps.input('descr', sql.VarChar);
    let sqlQuery = `use [${division_db}]; update  dbo.clientAttachments set descr=@descr where attachmentId=${id}`;
    if (attachment) {
      ps.input('attachment', sql.Image);
      sqlQuery = `use [${division_db}]; update  dbo.clientAttachments set descr=@descr, attachment=@attachment where attachmentId=${id}`;
      sqParams.attachment = attachment;
    }

    ps.prepare(sqlQuery, function(err) {
      if (err) {
        console.error(err);
        deferred.reject(err);
        return;
      }
      // check err
      ps.execute(sqParams, function(err, records) {
        // check err
        if (err) {
          console.error(err);
          deferred.reject(err);
          return;
        } else {
          deferred.resolve(records);
        }
        ps.unprepare(function(err) {
          if (err) {
            console.error(err);
            // deferred.reject(err);
          } else {
          }
          // check err
          // If no error, it's been inserted!
        });
      });
    });

    return deferred.promise;
  }

  deleteAttachment(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ;DELETE  dbo.clientAttachments where attachmentId=${id}`;

    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  // for get Location Data
  getLocation(db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${db}]; select *,str_locationid as locationID from dbo.tbl_location`;

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

  /**
   * get All Reminders
   * @return {promise} - that resolve client record.
   */
  getAllReminders(db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${db}];select dbo.clientReminders.description,dbo.clientReminders.expirationDate,dbo.clientReminders.Notes,
        dbo.client.FirstName + ' ' + dbo.client.LastName AS name
                from dbo.clientReminders
                INNER JOIN dbo.client ON dbo.clientReminders.ClientId = dbo.client.ClientId
                ORDER BY dbo.clientReminders.expirationDate ASC`;

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
}

module.exports = ClientModel;
