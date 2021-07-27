const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

//for the password encryption/decryption
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

class LoginModel {
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * Verify User based on username and password
   * @param {string} username - username
   * @param {string} password - password
   * @return {Promise} resolve status
   */
  verifySuperAdminUserDb(username, password) {
    const self = this;
    const deferred = Q.defer();
    const sql = `select * from dbo.securityUsers where userName='${username}'`;
    self.db
      .request()
      .query(sql)
      .then(result => {
        //check if user found with giver user name and then check if password matches
        if (
          result.recordset.length === 1 &&
          bcrypt.compareSync(password, result.recordset[0].userPassword)
        ) {
          //clear the password hash from the result not removed because of some front end dependncy
          result.recordset[0].userPassword = '';
          deferred.resolve({
            data: result.recordset,
            status: true
          });
          return;
        }

        //username or password does not match
        deferred.resolve({
          status: false,
          message: 'Invalid Username/Password'
        });
      })
      .catch(err => {
        console.trace(err);
        throw err;
        // reject here, not above throw;
      });
    return deferred.promise;
  }

  /**
   * Generate and update login token
   * @param {string} username - user Id
   * @param {string} password - password
   *  username, token, created date, valid upto
   * @returns {*} - token on valid user/pass
   */
  async loginUser(username, password, division_db) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}]; select * from dbo.securityUsers where enabled='1' and userName='${username}'`;
    let result = await self.db.request().query(sql);
    //check if user found with giver user name and then check if password matches
    if (
      result.recordset.length === 1 &&
      bcrypt.compareSync(password, result.recordset[0].password2)
    ) {
      delete result.recordset[0].userPassword;
      delete result.recordset[0].password2;
      return result.recordset[0];
    }
    return null;
  }

  /**
   * Generate and update login token
   * @param {string} username - user Id
   * @param {string} password - password
   *  username, token, created date, valid upto
   * @returns {*} - token on valid user/pass
   */
  async getUserWithToken(division_db, userName) {
    const sql = `use [${division_db}]; select * from dbo.securityUsers where userName='${userName}'`;
    let result = await this.db.request().query(sql);
    if (result.recordset.length === 1) {
      const user = result.recordset[0];
      delete user.userPassword;
      delete user.password2;
      const securityGroupResults = await this.db
        .request()
        .query(
          `use [${division_db}]; select * from dbo.securityUserGroups where userName='${userName}'`
        );
      user.securityGroups = securityGroupResults.recordset.reduce((obj, cur) => {
        obj[cur.GroupId] = cur;
        return obj;
      }, {});
      return user;
    }
    return null;
  }

  /**
   * Verify User based on username and password
   * @param {string} username - username
   * @param {string} password - password
   * @return {Promise} resolve status
   */
  verifyUserDbSluperAdmin(username, password) {
    const self = this;
    const deferred = Q.defer();
    const sql = `select * from AffinitySuperAdmin.dbo.switch_superadmin where user_name='${username}'`;
    self.db
      .request()
      .query(sql)
      .then(result => {
        //check if user found with giver user name and then check if password matches
        if (
          result.recordset.length === 1 &&
          bcrypt.compareSync(password, result.recordset[0].password)
        ) {
          //clear the password hash from the result not removed because of some front end dependncy
          result.recordset[0].password = '';
          deferred.resolve({
            data: result.recordset,
            status: true
          });
          return;
        }

        //username or password does not match
        deferred.resolve({
          status: false,
          message: 'Invalid Username/Password'
        });
      })
      .catch(err => {
        console.trace(err);
        throw err;
        // reject here, not above throw;
      });
    return deferred.promise;
  }
}

module.exports = LoginModel;
