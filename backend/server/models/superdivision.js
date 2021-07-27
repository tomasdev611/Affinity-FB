// code done by Jatin march 5

const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

class SuperAdminDivision {
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * get caregiver notes by ssn
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  getdivision(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `select * from AffinitySuperAdmin.dbo.switch_division_db ORDER BY AffinitySuperAdmin.dbo.switch_division_db.division_id DESC `;
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
   * get caregiver notes by ssn
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve client record.
   */
  getDivisionDatabase(division_id) {
    const self = this;
    const deferred = Q.defer();
    const sql = `select * from AffinitySuperAdmin.dbo.switch_division_db where AffinitySuperAdmin.dbo.switch_division_db.division_name='${division_id}'   `;
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

  // for add new division

  insertDivision(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `insert into AffinitySuperAdmin.dbo.switch_division_db(division_name,created_date,database_name) values('${
      params.division_name
    }','${createdDate}','${params.database_name}')`;
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

  // for delete division

  deleteDivision(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `DELETE AffinitySuperAdmin.dbo.switch_division_db where division_id=${id}`;

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

module.exports = SuperAdminDivision;
