const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

/**
 *
 */
class CasemanagerModel {
  /**
   *
   * @param {*} logger
   */
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   *
   */
  read(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}]; select * from dbo.casemanager`;
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

module.exports = CasemanagerModel;
