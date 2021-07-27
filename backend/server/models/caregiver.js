const Q = require('q');
const sql = require('mssql');
const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');
const database = require('./../lib/databasemssql');

/**
 *
 */
class CaregiverModel {
  /**
   *
   * @param {*} logger
   */
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * Read caregiver by Id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve caregiver record.
   */
  readById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //const sql = `select * from dbo.rw_caregivers where id='${id}' `;
    const sql = `use [${division_db}]; select *,StatusDate as HireDate,InactiveDate as TermDate from dbo.employee where SocialSecurityNum='${id}' `;
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
  // select hex(image) from table;

  /**
   *  for fetch all  Inactive caregiver
   */
  readAllData(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    // const sql = ` use [${division_db}]; select dbo.employee.*,dbo.employee.StatusDate as HireDate,dbo.employee.InactiveDate as TermDate, dbo.employee.className as Country,dbo.classification.Description as Class,
    //     paychexID as paychexID,MiddleInit as MiddleInitial,independentContractor as IndependentContractor,doNotRehire as DoNotRehire,str_Gender as Gender,str_reason as Reason
    //             from dbo.employee
    //             LEFT JOIN dbo.classification ON dbo.employee.ClassificationID=dbo.classification.ClassificationID `;
    // const sql = ` use [${division_db}]; select dbo.employee.* from dbo.employee`;
    const sql = ` use [${division_db}]; select dbo.employee.* from dbo.employee`;

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
   *  for fetch all  Inactive caregiver
   */
  readInactiveData(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    // const sql = ` use [${division_db}]; select dbo.employee.*,dbo.employee.StatusDate as HireDate,dbo.employee.InactiveDate as TermDate, dbo.employee.className as Country,dbo.classification.Description as Class,
    // paychexID as paychexID,MiddleInit as MiddleInitial,independentContractor as IndependentContractor,doNotRehire as DoNotRehire,str_Gender as Gender
    //         from dbo.employee
    //         LEFT JOIN dbo.classification ON dbo.employee.ClassificationID=dbo.classification.ClassificationID  `;

    const sql = ` use [${division_db}]; select dbo.employee.*,dbo.employee.StatusDate as HireDate,dbo.employee.InactiveDate as TermDate, dbo.employee.className as Country,dbo.classification.Description as Class,
        paychexID as paychexID,MiddleInit as MiddleInitial,independentContractor as IndependentContractor,doNotRehire as DoNotRehire,str_Gender as Gender,str_reason as Reason
                from dbo.employee
                LEFT JOIN dbo.classification ON dbo.employee.ClassificationID=dbo.classification.ClassificationID  where  NOT str_reason='TERMINATED' and Status='I'  `;

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
   *  for fetch all Active caregiver
   */
  readActiveData(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    // const sql = ` use [${division_db}]; select dbo.employee.*,dbo.employee.StatusDate as HireDate,dbo.employee.InactiveDate as TermDate, dbo.employee.className as Country,dbo.classification.Description as Class,
    // paychexID as paychexID,MiddleInit as MiddleInitial,independentContractor as IndependentContractor,doNotRehire as DoNotRehire,str_Gender as Gender
    //         from dbo.employee
    //         LEFT JOIN dbo.classification ON dbo.employee.ClassificationID=dbo.classification.ClassificationID  `;

    const sql = ` use [${division_db}]; select dbo.employee.*,dbo.employee.StatusDate as HireDate,dbo.employee.InactiveDate as TermDate, dbo.employee.className as Country,dbo.classification.Description as Class,
        paychexID as paychexID,MiddleInit as MiddleInitial,independentContractor as IndependentContractor,doNotRehire as DoNotRehire,str_Gender as Gender, str_reason as Reason
                from dbo.employee
                LEFT JOIN dbo.classification ON dbo.employee.ClassificationID=dbo.classification.ClassificationID  where  NOT str_reason='TERMINATED' and Status='A'  `;

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
   * Read caregiver with the caring hours assigned to them
   * @return {promise} - that resolve caregiver record.
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
      calEndDate.setDate(dayLeftWeek + calMonthDay + 1); //end of the week

      calDate.setDate(calMonthDay);

      calStartDate.setDate(calMonthDay); //start of the week
      calEndDate.setDate(calMonthDay + 1); //end of the week
    }

    currentDate = calDate.toISOString().substring(0, 10);
    calStartDate = calStartDate.toISOString().substring(0, 10);
    calEndDate = calEndDate.toISOString().substring(0, 10);

    const self = this;
    const deferred = Q.defer();

    const sql = `use [${division_db}];With  customSchedule as ( SELECT  SocialSecNum,StartTime,EndTime,
            ISNULL(ABS(DATEDIFF(HOUR,StartTime,EndTime)), 0) as TotalTime FROM
            dbo.schedules where (CONVERT(datetime,StartTime) >= '${calStartDate}'
            OR  CONVERT(datetime,EndTime) >= '${calStartDate}')
            AND (CONVERT(datetime,StartTime) <= '${calEndDate}'
            OR  CONVERT(datetime,EndTime) <= '${calEndDate}') )
       select SocialSecurityNum,FirstName,LastName ,SUM(TotalTime) as total_hours
       from customSchedule RIGHT JOIN dbo.employee
       ON dbo.employee.SocialSecurityNum = customSchedule.SocialSecNum
       where NOT str_reason='TERMINATED' and dbo.employee.Status='A'
       GROUP BY SocialSecurityNum,FirstName,LastName order by FirstName`;

    // const sql = `use [${division_db}];With  customSchedule as ( SELECT  SocialSecNum,StartTime,EndTime,
    //      ISNULL(ABS(DATEDIFF(HOUR,StartTime,EndTime)), 0) as TotalTime FROM dbo.schedules WHERE (StartTime >= dateadd(day, 1-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}'))
    // AND StartTime <  dateadd(day, ${duration}-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}')) ) OR (EndTime >= dateadd(day, 1-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}'))
    // AND EndTime <  dateadd(day, ${duration}-datepart(dw, '${currentDate}'), CONVERT(date,'${currentDate}')) ) )
    // select SocialSecurityNum,FirstName,LastName ,SUM(TotalTime) as total_hours from customSchedule RIGHT JOIN dbo.employee ON dbo.employee.SocialSecurityNum = customSchedule.SocialSecNum  GROUP BY SocialSecurityNum,FirstName,LastName order by FirstName`;

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
  getCustomFields(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //Todo put condition to fetch only the column which are active
    const sql = `use [${division_db}];DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX) SET @cols = STUFF((SELECT distinct ',' + QUOTENAME(cfieldName)
        FROM dbo.CaregiverCustomFields c
        FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)')
    ,1,1,'')
    set @query = 'SELECT SocialSecNum, ' + @cols + ' from
        (
            select SocialSecNum
                , descr
                , cfieldName
            from dbo.CaregiverCustomFields
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
        const sqlColumns = `use [${division_db}]; SELECT cfieldName FROM dbo.CustomFields WHERE showCaregiver=1 ORDER BY created DESC`;

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
                if (key != 'SocialSecNum' && columns.indexOf(key) < 0) {
                  //remove the key
                  delete row[key];
                }
              }

              result.recordset[m] = row;
            }

            //deferred.resolve(columns);

            //loop through the result set to remove all the non
            deferred.resolve(result.recordset);
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

  getEmployeeImages(id, division_db) {
    const self = this;
    const deferred = Q.defer();
    //const sql = `select * from dbo.rw_caregivers where id='${id}' `;
    const sql = `use [${division_db}]; select * from dbo.tbl_images_employee where SocialSecurityNum='${id}' `;
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

  deleteEmployeeImages(id, division_db) {
    const self = this;
    const deferred = Q.defer();
    //const sql = `select * from dbo.rw_caregivers where id='${id}' `;
    const sql = `use [${division_db}]; DELETE dbo.tbl_images_employee where SocialSecurityNum='${id}' `;
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

  async uploadEmployeeImages(id, bin_image, division_db) {
    // const self = this;
    // const deferred = Q.defer();
    // //const sql = `select * from dbo.rw_caregivers where id='${id}' `;
    // const sql = `use [${division_db}]; select * from dbo.tbl_images_employee where SocialSecurityNum='${id}' `;
    // self.db.request().query(sql)
    //   .then(result => {
    //     deferred.resolve(result.recordset);
    //   })
    //   .catch(err => {
    //     console.trace(err); // todo : will do to logger later
    //     deferred.reject(err);
    //   });
    // return deferred.promise;

    const self = this;
    const deferred = Q.defer();
    var ps = new sql.PreparedStatement(self.db);
    ps.input('bin_image', sql.Image);
    ps.input('id', sql.VarChar);
    ps.prepare(
      `use [${division_db}]; update dbo.tbl_images_employee set bin_image=@bin_image where SocialSecurityNum=@id
      IF @@ROWCOUNT=0
         insert into dbo.tbl_images_employee(SocialSecurityNum, bin_image) values(@id, @bin_image);`,
      function(err) {
        if (err) {
          console.error(err);
          deferred.reject(err);
          return;
        }
        // check err
        ps.execute({id, bin_image}, function(err, records) {
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
      }
    );

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
    //const sql = `select * from dbo.rw_caregivers where id='${id}' `;
    //    const sql = `use [${division_db}] ;SELECT COUNT(dbo.Visits.clientID) as total_visits,MIN(dbo.Visits.visitDate) as first_visit,MAX(dbo.Visits.visitDate) as last_visit, dbo.Visits.clientID,dbo.client.FirstName,dbo.client.LastName FROM dbo.Visits INNER JOIN dbo.client ON dbo.Visits.clientID = dbo.client.ClientId  WHERE dbo.Visits.socSecNum='${id}' GROUP BY dbo.Visits.clientID,dbo.client.FirstName,dbo.client.LastName`;
    const sql = `use [${division_db}] ;SELECT COUNT(dbo.schedules.ClientId) as total_visits,MIN(dbo.schedules.StartTime) as first_visit,
        MAX(dbo.schedules.EndTime) as last_visit, dbo.schedules.clientID,dbo.client.FirstName,
        dbo.client.LastName FROM dbo.schedules INNER JOIN dbo.client ON dbo.schedules.ClientId = dbo.client.ClientId
         WHERE dbo.schedules.SocialSecNum='${id}' GROUP BY dbo.schedules.ClientId,dbo.client.FirstName,dbo.client.LastName`;
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
   * @param {string} id -
   * @return {promise} -
   */
  attachmentById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //no data field
    const sql = `use [${division_db}];select * from dbo.caregiverAttachments where socialSecNum='${id}' ORDER BY attachmentId DESC `;
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

  // Feb-23 by Jatin Insert Attachment in db
  insertAttachment(params, division_db, token) {
    // const self = this;
    // const deferred = Q.defer();
    // const sqlQuery = `use [${division_db}]; insert into  dbo.caregiverAttachments(socialSecNum,descr,str_filename) values('${
    //   params.socialSecNum
    // }','${params.descr}','${params.str_filename}')`;
    // self.db
    //   .request()
    //   .query(sqlQuery)
    //   .then(result => {
    //     deferred.resolve(result);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     deferred.reject(err);
    //   });
    // return deferred.promise;

    const self = this;
    const deferred = Q.defer();
    var ps = new sql.PreparedStatement(self.db);
    ps.input('attachment', sql.Image);
    ps.input('socialSecNum', sql.VarChar);
    ps.input('descr', sql.VarChar);
    ps.prepare(
      `use [${division_db}]; INSERT INTO dbo.caregiverAttachments(socialSecNum,descr,attachment) VALUES (@socialSecNum, @descr, @attachment)`,
      function(err) {
        if (err) {
          console.error(err);
          deferred.reject(err);
          return;
        }
        // check err
        ps.execute(params, function(err, records) {
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
      }
    );

    return deferred.promise;
  }
  // for update attachments
  updateAttachment(params, id, division_db, token) {
    // const self = this;
    // const deferred = Q.defer();
    // const sqlQuery = `use [${division_db}]; update  dbo.caregiverAttachments set descr='${
    //   params.descr
    // }',str_filename='${params.str_filename}' where attachmentId=${id}`;
    // self.db
    //   .request()
    //   .query(sqlQuery)
    //   .then(result => {
    //     deferred.resolve(result);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     deferred.reject(err);
    //   });
    // return deferred.promise;
    const self = this;
    const deferred = Q.defer();
    var ps = new sql.PreparedStatement(self.db);
    let sqParams = {descr: params.descr};
    ps.input('descr', sql.VarChar);
    let sqlQuery = `use [${division_db}]; update  dbo.caregiverAttachments set descr=@descr where attachmentId=${id}`;
    if (params.attachment) {
      ps.input('attachment', sql.Image);
      sqlQuery = `use [${division_db}]; update  dbo.caregiverAttachments set descr=@descr, attachment=@attachment where attachmentId=${id}`;
      sqParams.attachment = params.attachment;
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

  // for deletion attachments
  deleteAttachment(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; DELETE  dbo.caregiverAttachments where attachmentId=${id}`;
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
   * get attachement by id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  contactsById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select * from dbo.switch_employee_contacts where SocialSecurityNum='${id}' ORDER BY created DESC `;
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
    const sql = `use [${division_db}] ;select * from dbo.employeeExpirations where SocialSecurityNum='${id}' ORDER BY created DESC`;
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
  getAllReminders(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}] ;select dbo.employeeExpirations.description,dbo.employeeExpirations.expirationDate,dbo.employeeExpirations.Notes,dbo.employee.FirstName + ' ' +dbo.employee.LastName AS name
        from dbo.employeeExpirations INNER JOIN dbo.employee ON dbo.employeeExpirations.SocialSecurityNum = dbo.employee.SocialSecurityNum
        ORDER BY dbo.employeeExpirations.expirationDate ASC`;

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
   * @param {*} params
   */
  create(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; insert into table(name) values('${params.name}')`;

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
   * @param {*} params
   */
  updatePersonalData(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; update dbo.employee set StatusDate='${
      params.HireDate
    }',InactiveDate='${params.TermDate}',LastName='${params.LastName}',FirstName='${
      params.FirstName
    }',MiddleInit='${params.MiddleInit}',ValidDriversLicense='${
      params.ValidDriversLicense
    }',Smoker='${params.Smoker}',WeightRestriction='${params.WeightRestriction}',WeightLimit=${
      params.WeightLimit
    },ClassificationID=${params.ClassificationID},DateofBirth='${params.DateofBirth}',Status='${
      params.Status
    }',StatusDate='${params.StatusDate}',InactiveDate='${params.InactiveDate}',Email='${
      params.Email
    }',QuickBooksId='${params.QuickBooksId}',CertExpirationDate='${
      params.CertExpirationDate
    }',Certification='${params.Certification}',payOvertime=${params.payOvertime},CreateQbTSheets=${
      params.CreateQbTSheets
    },Phone1='${params.Phone1}',BackgroundCheck=${params.BackgroundCheck},className='${
      params.className
    }',notes='${params.notes}',createdBy='${params.createdBy}',created='${
      params.created
    }',updatedBy='${params.updatedBy}',lastUpdated='${params.lastUpdated}',independentContractor=${
      params.independentContractor
    },telephonyID='${params.telephonyID}',doNotRehire=${params.doNotRehire},int_statusid='${
      params.int_statusid
    }',str_reason='${params.str_reason}',paychexID='${params.paychexID}',NPI='${
      params.NPI
    }',str_Gender='${params.str_Gender}',MessageID='${params.MessageID}',TextMessage='${
      params.TextMessage
    }' where SocialSecurityNum='${id}'`;
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
   * @param {*} params
   */
  updateAddress(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; update dbo.employee set Address1='${
      params.Address1
    }',Address2='${params.Address2}',City='${params.City}',County='${params.County}',State='${
      params.State
    }',Zip='${params.Zip}' where SocialSecurityNum='${id}'`;
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
  delete(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; delete table where id='${id}'`;

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

  insertPhone(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}];insert into  dbo.switch_employee_contacts(SocialSecurityNum,Name,ContactEmail,OtherContactInfo,Phone,Fax,createdBy) values('${
      params.SocialSecurityNum
    }','${params.Name}','${params.Email}','${params.ContactDesrc}','${params.Phone}','${
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

  insertRemind(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}];insert into  dbo.employeeExpirations(SocialSecurityNum,description,expirationDate,Notes,ReminderOn) values('${
      params.ssn
    }','${params.description}','${params.expirationDate}','${params.Notes}',${params.ReminderOn})`;
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

  // for deletion attachments
  deleteReminder(ssn, edate, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; DELETE  dbo.employeeExpirations where SocialSecurityNum='${ssn}' and expirationDate='${edate}'`;
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
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.Reminders where caregivers=1 ORDER BY description asc`;
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

  updateReminder(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}];update  dbo.employeeExpirations set description='${
      params.description
    }',expirationDate='${params.expirationDate}',Notes='${params.Notes}',ReminderOn=${
      params.ReminderOn
    } where ExpirationID='${params.ExpirationID}' and SocialSecurityNum=${
      params.SocialSecurityNum
    }`;
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
    const sqlQuery = `use [${division_db}]; update  dbo.switch_employee_contacts set SocialSecurityNum=${
      params.SocialSecurityNum
    },Name='${params.Name}',ContactEmail='${params.Email}',OtherContactInfo='${
      params.BuesinessPhone
    }',Phone='${params.Phone}' where SocialSecurityNum=${SocialSecurityNum}`;
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
   * API to add a new Caregiver
   * Shyam
   * TODO: Testing
   */

  /**
   *
   * @param {*} params
   */
  addCaregiver(params, division_db, token) {
    const self = this;

    const deferred = Q.defer();
    let createDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}]; insert into dbo.employee (SocialSecurityNum,LastName,
            FirstName,MiddleInit,ValidDriversLicense,Smoker,ClassificationID,DateofBirth,StatusDate,InactiveDate,Status,
            Email,BackgroundCheck,createdBy,created,doNotRehire,paychexID,NPI,str_Gender,
            TextMessage,profile_url,Phone1,independentContractor,WeightRestriction,Address1,
            Address2,City,County,State,Zip,str_reason,className)
                            VALUES(
                           '${params.SocialSecurityNum}',
                            '${params.LastName}',
                            '${params.FirstName}',
                            '${params.MiddleInit}',
                            '${params.ValidDriversLicense ? params.ValidDriversLicense : ''}',
                            '${params.Smoker ? params.Smoker : ''}',
                            '${params.ClassificationID ? params.ClassificationID : ''}',
                            '${params.DateofBirth ? params.DateofBirth : ''}',
                            '${params.StatusDate ? params.StatusDate : ''}',
                            '${params.InactiveDate ? params.InactiveDate : ''}',
                            '${params.Status ? params.Status : ''}',
                            '${params.Email ? params.Email : ''}',
                            '${params.BackgroundCheck ? params.BackgroundCheck : ''}',
                            '${params.createdBy ? params.createdBy : ''}',
                            '${createDate}',
                            '${params.doNotRehire ? params.doNotRehire : ''}',
                            '${params.paychexID ? params.paychexID : ''}',
                            '${params.NPI ? params.NPI : ''}',
                            '${params.str_Gender ? params.str_Gender : ''}',
                            '${params.TextMessage ? params.TextMessage : ''}',
                            '${params.profile_url ? params.profile_url : ''}',
                            '${params.Phone1 ? params.Phone1 : ''}',
                            '${params.independentContractor ? params.independentContractor : ''}',
                            '${params.WeightRestriction ? params.WeightRestriction : ''}',
                            '${params.Address1 ? params.Address1 : ''}',
                            '${params.Address2 ? params.Address2 : ''}',
                            '${params.City ? params.City : ''}',
                            '${params.County ? params.County : ''}',
                            '${params.State ? params.State : ''}',
                            '${params.Zip ? params.Zip : ''}',
                            '${params.str_reason ? params.str_reason : ''}',
                            '${params.className}'
                            )`;
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

  // for fetch classfication table data
  getClaasificationID(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}];select * from dbo.classification`;
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
  // for fetch classfication table data
  getClassType(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}];select * from dbo.class`;
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
   * API to update Caregiver
   * Jatin
   * TODO: Testing
   */

  /**
   *
   * @param {*} params
   */

  updateCaregiver(params, division_db, token) {
    let lastUpdated = new Date().toLocaleDateString('en-US');

    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; update dbo.employee set
                        LastName='${params.LastName ? params.LastName : ''}',
                        FirstName='${params.FirstName ? params.FirstName : ''}',
                        MiddleInit='${params.MiddleInit ? params.MiddleInit : ''}',
                        ValidDriversLicense='${
                          params.ValidDriversLicense ? params.ValidDriversLicense : ''
                        }',
                        Smoker='${params.Smoker ? params.Smoker : ''}',
                        ClassificationID='${
                          params.ClassificationID ? params.ClassificationID : ''
                        }',
                        DateofBirth='${params.DateofBirth ? params.DateofBirth : ''}',
                        StatusDate='${params.StatusDate ? params.StatusDate : ''}',
                        InactiveDate='${params.InactiveDate ? params.InactiveDate : ''}',
                        Status='${params.Status ? params.Status : ''}',
                        Email='${params.Email ? params.Email : ''}',
                        BackgroundCheck='${params.BackgroundCheck ? params.BackgroundCheck : ''}',
                        updatedBy='${params.updatedBy ? params.updatedBy : ''}',
                        lastUpdated='${lastUpdated}',
                        doNotRehire='${params.doNotRehire ? params.doNotRehire : ''}',
                        paychexID='${params.paychexID ? params.paychexID : ''}',
                        NPI='${params.NPI ? params.NPI : ''}',
                        str_Gender='${params.str_Gender ? params.str_Gender : ''}',
                        TextMessage='${params.TextMessage ? params.TextMessage : ''}',
                        profile_url='${params.profile_url ? params.profile_url : ''}',
                        Phone1='${params.Phone1 ? params.Phone1 : ''}',
                        independentContractor='${
                          params.independentContractor ? params.independentContractor : ''
                        }',
                        WeightRestriction='${
                          params.WeightRestriction ? params.WeightRestriction : ''
                        }',
                        Address1='${params.Address1 ? params.Address1 : ''}',
                        Address2='${params.Address2 ? params.Address2 : ''}',
                        City='${params.City ? params.City : ''}',
                        County='${params.County ? params.County : ''}',
                        className='${params.className ? params.className : ''}',
                        State='${params.State ? params.State : ''}',
                        Zip='${params.Zip ? params.Zip : ''}',
                        str_reason='${params.str_reason ? params.str_reason : ''}'
                    where SocialSecurityNum='${
                      params.SocialSecurityNum ? params.SocialSecurityNum : ''
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
}

module.exports = CaregiverModel;
