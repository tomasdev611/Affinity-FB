const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

//for the password encryption/decryption
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

/**
 *
 */
class SecurityUsersModel {
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
   * @param {*} params
   */
  read(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql =
      ' use [' +
      division_db +
      '] ; SELECT dbo.securityUsers.userName,dbo.securityUsers.enabled,dbo.securityUsers.str_email FROM dbo.securityUsers';
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
  addUser(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    //check if same user name or email is already registered
    const sql_check = ` use [${division_db}];SELECT * FROM dbo.securityUsers WHERE userName = '${
      params.userName
    }' OR str_email='${params.str_email}'`;

    self.db
      .request()
      .query(sql_check)
      .then(result => {
        if (result.recordset.length == 0) {
          //encrypt the password
          params.password2 = bcrypt.hashSync(params.userPassword, salt);
          const sql = ` use [${division_db}] ; INSERT INTO dbo.securityUsers (userName,password2,enabled,str_email) VALUES('${
            params.userName
          }','${params.userPassword}','${params.enabled}','${params.str_email}')`;
          self.db
            .request()
            .query(sql)
            .then(result => {
              deferred.resolve({
                data: result.recordset,
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        } else {
          deferred.resolve({
            data: result.recordset,
            status: false
          });
        }
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
  resetPassword(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();

    //encrypt the password
    params.userPassword = bcrypt.hashSync(params.userPassword, salt);

    const sql = `use [${division_db}]; UPDATE dbo.securityUsers SET dbo.securityUsers.password2 = '${
      params.userPassword
    }' WHERE dbo.securityUsers.userName='${id}'`;
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
  getAcl(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = ` use [${division_db}]; SELECT dbo.securityUserGroups.GroupId,dbo.securityUserGroups.bit_read,dbo.securityUserGroups.bit_update,dbo.securityUserGroups.bit_delete FROM dbo.securityUserGroups WHERE dbo.securityUserGroups.userName='${id}'`;
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
  enableUser(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = ` use [${division_db}]; UPDATE dbo.securityUsers SET dbo.securityUsers.enabled = 1 WHERE dbo.securityUsers.userName='${id}'`;
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
  disableUser(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = ` use [${division_db}] ; UPDATE dbo.securityUsers SET dbo.securityUsers.enabled = 0 WHERE dbo.securityUsers.userName='${id}'`;
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

module.exports = SecurityUsersModel;
