const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

/**
 *
 */
class SecurityGroupModel {
  /**
   *
   * @param {*} logger
   */
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * Read user groups by
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve business record.
   */
  readById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql =
      'use [' +
      division_db +
      "]; WITH customUserGroups as (select dbo.securityUserGroups.GroupId,dbo.securityUserGroups.bit_read,dbo.securityUserGroups.bit_update,dbo.securityUserGroups.bit_delete from dbo.securityUserGroups WHERE dbo.securityUserGroups.userName='" +
      id +
      "') SELECT dbo.securityGroups.GroupId,customUserGroups.bit_read,customUserGroups.bit_update,customUserGroups.bit_delete,Descr from customUserGroups RIGHT JOIN  dbo.securityGroups ON customUserGroups.GroupId=dbo.securityGroups.GroupId";
    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordsets[0]);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Read user groups by
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve business record.
   */
  readClassById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql =
      'use [' +
      division_db +
      "] ; WITH customUserClass as (select dbo.tbl_securityusers_class.str_userName,dbo.tbl_securityusers_class.str_className from dbo.tbl_securityusers_class WHERE dbo.tbl_securityusers_class.str_userName='" +
      id +
      "') SELECT dbo.class.className as avialable_classes,customUserClass.str_className as allocated_classes from customUserClass RIGHT JOIN  dbo.class ON customUserClass.str_className=dbo.class.className";
    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordsets[0]);
      })
      .catch(err => {
        console.trace(err); // todo : will do to logger later
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Read user groups by
   * @param {string} id - Id to look up by
   * @return {promise} - that resolve business record.
   */
  readLocationById(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sql =
      'use [' +
      division_db +
      "] ; WITH customUserLocation as (select dbo.tbl_securityusers_location.str_userName,dbo.tbl_securityusers_location.str_locationID from dbo.tbl_securityusers_location WHERE dbo.tbl_securityusers_location.str_userName='" +
      id +
      "') SELECT dbo.tbl_location.str_locationid as avialable_location,customUserLocation.str_locationID as allocated_location from customUserLocation RIGHT JOIN  dbo.tbl_location ON customUserLocation.str_locationID=dbo.tbl_location.str_locationid";
    self.db
      .request()
      .query(sql)
      .then(result => {
        deferred.resolve(result.recordsets[0]);
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
    const sql = `use [${division_db}] ; select * from table `;
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
   * this will be used to create/update the security group setting for an user
   * check if the data is available then udpate it else add the data
   * @param {*} params
   */
  create(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery =
      'use [' +
      division_db +
      "] ; SELECT * FROM dbo.securityUserGroups where dbo.securityUserGroups.userName = '" +
      params.userName +
      "' AND dbo.securityUserGroups.GroupId ='" +
      params.GroupId +
      "'";

    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        //check if already presenet
        if (result.rowsAffected > 0) {
          //update the record
          const updateSql =
            ' use [' +
            division_db +
            "] ;  Update dbo.securityUserGroups SET dbo.securityUserGroups.bit_read = '" +
            params.bit_read +
            "', dbo.securityUserGroups.bit_update = '" +
            params.bit_update +
            "', dbo.securityUserGroups.bit_delete = '" +
            params.bit_delete +
            "' where dbo.securityUserGroups.userName = '" +
            params.userName +
            "' AND dbo.securityUserGroups.GroupId ='" +
            params.GroupId +
            "'";

          self.db
            .request()
            .query(updateSql)
            .then(result => {
              deferred.resolve({
                data: 'data updated',
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        } else {
          //add the record
          const addSql =
            ' use [' +
            division_db +
            "] ; INSERT INTO dbo.securityUserGroups (userName,GroupId,bit_read,bit_update,bit_delete) VALUES ('" +
            params.userName +
            "','" +
            params.GroupId +
            "', '" +
            params.bit_read +
            "', '" +
            params.bit_update +
            "', '" +
            params.bit_delete +
            "')";

          self.db
            .request()
            .query(addSql)
            .then(result => {
              deferred.resolve({
                data: 'data added',
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        }
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * this will be used to create/update the Class setting for an user
   * check if the data is available then udpate it else add the data
   * @param {*} params
   */
  createClass(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery =
      ' use [' +
      division_db +
      "] ; SELECT * FROM dbo.tbl_securityusers_class where dbo.tbl_securityusers_class.str_userName = '" +
      params.userName +
      "' AND dbo.tbl_securityusers_class.str_className ='" +
      params.className +
      "'";

    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        //check if already presenet
        if (result.rowsAffected > 0) {
          //update the record
          const updateSql =
            ' use [' +
            division_db +
            "] ;  DELETE dbo.tbl_securityusers_class where dbo.tbl_securityusers_class.str_userName = '" +
            params.userName +
            "' AND dbo.tbl_securityusers_class.str_className ='" +
            params.className +
            "'";

          self.db
            .request()
            .query(updateSql)
            .then(result => {
              deferred.resolve({
                data: 'data deleted',
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        } else {
          //add the record
          const addSql =
            ' use [' +
            division_db +
            "] ;  INSERT INTO dbo.tbl_securityusers_class (str_userName,str_className) VALUES ('" +
            params.userName +
            "','" +
            params.className +
            "')";

          self.db
            .request()
            .query(addSql)
            .then(result => {
              deferred.resolve({
                data: 'data added',
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        }
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * this will be used to create/update the Location setting for an user
   * check if the data is available then udpate it else add the data
   * @param {*} params
   */
  createLocation(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery =
      ' use [' +
      division_db +
      "] ;  SELECT * FROM dbo.tbl_securityusers_location where dbo.tbl_securityusers_location.str_userName = '" +
      params.userName +
      "' AND dbo.tbl_securityusers_location.str_locationID ='" +
      params.locationID +
      "'";

    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        //check if already presenet
        if (result.rowsAffected > 0) {
          //update the record
          const updateSql =
            ' use [' +
            division_db +
            "] ;  DELETE dbo.tbl_securityusers_location where dbo.tbl_securityusers_location.str_userName = '" +
            params.userName +
            "' AND dbo.tbl_securityusers_location.str_locationID ='" +
            params.locationID +
            "'";

          self.db
            .request()
            .query(updateSql)
            .then(result => {
              deferred.resolve({
                data: 'data deleted',
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        } else {
          //add the record
          const addSql =
            ' use [' +
            division_db +
            "] ;  INSERT INTO dbo.tbl_securityusers_location (str_userName,str_locationID) VALUES ('" +
            params.userName +
            "','" +
            params.locationID +
            "')";

          self.db
            .request()
            .query(addSql)
            .then(result => {
              deferred.resolve({
                data: 'data added',
                status: true
              });
            })
            .catch(err => {
              console.trace(err); // todo : will do to logger later
              deferred.reject(err);
            });
        }
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  /**
   * Not in use
   * @param {*} id
   * @param {*} params
   */
  update(id, params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}];update table set name='${params.name}' where id='${id}'`;

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
   * Not in use
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

  /*
   *  code by Jatin from Feb-21
   */
  /**
   * add a new Location in table
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addLocation(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let dtm_created = new Date().toLocaleDateString('en-US');
    let dtm_lastUpdated = new Date().toLocaleDateString('en-US');

    const sqlQuery = `use [${division_db}];insert into dbo.tbl_location(str_locationid,str_createdBy, dtm_created , str_updatedBy, dtm_lastUpdated) values('${
      params.str_locationid
    }','${params.str_createdBy}','${dtm_created}','${params.str_updatedBy}','${dtm_lastUpdated}')`;

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
   *   for delete location
   * @param {*} id
   */

  deleteLocation(id, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; DELETE  dbo.tbl_location where str_locationid=${id}`;

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

module.exports = SecurityGroupModel;
