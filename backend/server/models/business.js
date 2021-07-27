const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

/**
 *
 */
class BusinessModel {
  /**
   *
   * @param {*} logger
   */
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * Read business by Id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve business record.
   */
  readById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    // ,logo_url is not in the database
    const sql = `use [${division_db}]; select CompanyName,TIN,Address,City,State,Zip,Phone,providerNum,FranchiseID,AgencyID,logo,PayPeriodEndDay,bit_CmpNameOnReports from  dbo.ADMIN_OPTIONS where CompanyName='AFFINITY HOME CARE, INC.'`;
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
   * Read company setting by id
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve business record.
   */
  readSettingsById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}]; select securityOn,ReadOnlyNotes,inactivityTimeout from  dbo.ADMIN_OPTIONS where CompanyName='AFFINITY HOME CARE, INC.'`;
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
   * @param {*} params
   */
  read(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql = `use [${division_db}]; select * from table `;
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
    const sqlQuery =
      ' use [' +
      division_db +
      "] ; update dbo.ADMIN_OPTIONS set FranchiseID='" +
      params.FranchiseID +
      "' , CompanyName='" +
      params.CompanyName +
      "',TIN='" +
      params.TIN.replace('-', '') +
      "',Address='" +
      params.Address +
      "',City='" +
      params.City +
      "',State='" +
      params.State +
      "',Zip='" +
      params.Zip +
      "',Phone='" +
      params.Phone.replace(' ', '')
        .replace('-', '')
        .replace('(', '')
        .replace(')', '') +
      "',providerNum='" +
      params.providerNum
        .replace('-', '')
        .replace('(', '')
        .replace(')', '')
        .replace(' ', '') +
      "',AgencyID='" +
      params.AgencyID +
      "',PayPeriodEndDay=" +
      params.PayPeriodEndDay +
      ",bit_CmpNameOnReports='" +
      params.bit_CmpNameOnReports +
      "',logo_url='" +
      params.logo_url +
      "' where CompanyName='AFFINITY HOME CARE, INC.'";
    //const sqlQuery="update dbo.ADMIN_OPTIONS set CompanyName='AHC' ,TIN='', Address='',City='',State='',Zip='',Phone='',providerNum='' where CompanyName='AHC'";
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
   * Function to update the company settings
   * @param {*} params
   */
  updateLogoById(req, res, division_db, token) {
    const fs = require('fs');

    const self = this;
    const deferred = Q.defer();

    fs.rename(req.files['file'].path, './public/uploads/' + req.files['file'].name, function(err) {
      //res.send("file uploaded");
      //save file to the database
      var stream = fs.createReadStream('./public/uploads/' + req.files['file'].name);

      const sqlQuery =
        'use [' +
        division_db +
        '];update dbo.ADMIN_OPTIONS set dbo.logo = ' +
        stream +
        " where CompanyName='AFFINITY HOME CARE, INC.'";
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
      return deferred.promise;
    });
  }

  /**
   * Function to update the company settings
   * @param {*} params
   */
  updateSettingsById(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    if (params.securityOn == 'undefined' || params.securityOn == undefined) {
      params.securityOn = false;
    }
    if (params.ReadOnlyNotes == 'undefined' || params.ReadOnlyNotes == undefined) {
      params.ReadOnlyNotes = false;
    }
    if (params.inactivityTimeout == 'undefined' || params.inactivityTimeout == '') {
      params.inactivityTimeout = 999;
    }
    const sqlQuery =
      ' use [' +
      division_db +
      "]; update dbo.ADMIN_OPTIONS set dbo.ADMIN_OPTIONS.securityOn = '" +
      params.securityOn +
      "' , dbo.ADMIN_OPTIONS.ReadOnlyNotes='" +
      params.ReadOnlyNotes +
      "', dbo.ADMIN_OPTIONS.inactivityTimeout=" +
      params.inactivityTimeout +
      " where CompanyName='AFFINITY HOME CARE, INC.'";
    //const sqlQuery="update dbo.ADMIN_OPTIONS set CompanyName='AHC' ,TIN='', Address='',City='',State='',Zip='',Phone='',providerNum='' where CompanyName='AHC'";
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

  /**
   *
   * @param {*} id
   * @param {*} params
   */
  update(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}]; update table set name='${
      params.name
    }' where id='${id}'`;

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
}

module.exports = BusinessModel;
