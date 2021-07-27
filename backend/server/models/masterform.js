// code done by Jatin Feb 24

const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
const database = require('./../lib/databasemssql');

class MasterFormModel {
  constructor(logger) {
    this.logger = logger;
    this.db = database.getDb();
  }

  /**
   * get reason
   * @param {string} none
   * @return {Promise} resolve status
   */
  getLocation(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.tbl_location ORDER BY dtm_created DESC`;
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

  /**
   * get reason
   * @param {string} none
   * @return {Promise} resolve status
   */
  getReason(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.tbl_reasons ORDER BY str_reason asc`;
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

  /**
   * get physician
   * @param {string} none
   * @return {Promise} resolve status
   */
  getPhysician(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.physician ORDER BY PhysicianName DESC`;
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

  /**
   * get clientType
   * @param {string} none
   * @return {Promise} resolve status
   */
  getClientType(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.ClientType ORDER BY Name DESC`;
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

  /**
   * get services
   * @param {string} none
   * @return {Promise} resolve status
   */
  getServices(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT dbo.services.*,dbo.itemtype.Description as itemDescription FROM dbo.services INNER JOIN dbo.itemtype ON dbo.services.ItemTypeId = dbo.itemtype.ItemTypeId ORDER BY created DESC`;
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

  /**
   * get services
   * @param {string} none
   * @return {Promise} resolve status
   */
  getServiceItems(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.itemtype`;
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

  /**
   * get client note type
   * @param {string} none
   * @return {Promise} resolve status
   */
  getClientNoteType(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.clientNoteType ORDER BY description DESC`;
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

  /**
   * get client note type
   * @param {string} none
   * @return {Promise} resolve status
   */
  getCaregiverNoteType(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.caregiverNoteType ORDER BY description DESC`;
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

  /**
   * get class name
   * @param {string} none
   * @return {Promise} resolve status
   */
  getClassesName(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.class ORDER BY className ASC`;
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
  /**
   * get all classification
   * @param {string} none
   * @return {Promise} resolve status
   */
  getClassification(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.classification ORDER BY Description DESC`;
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

  /**
   * get all classification
   * @param {string} none
   * @return {Promise} resolve status
   */
  getCounty(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.switch_county ORDER BY county DESC`;
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
  /**
   * get all case manager
   * @param {string} none
   * @return {Promise} resolve status
   */
  getCaseManager(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.casemanager ORDER BY FirstName asc`;
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
  /**
   * get all case manager
   * @param {string} none
   * @return {Promise} resolve status
   */
  getAllReminders(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.Reminders ORDER BY description asc`;
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
  // to start code for add new data in masters list
  /**
   * to start code for add a new location
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addLocation(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; insert into dbo.tbl_location(str_locationid,str_createdBy,dtm_created) values('${
      params.str_locationid
    }','${params.str_createdBy}','${createdDate}')`;
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
   * add a new reason
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addReason(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.tbl_reasons(str_reason,str_createdBy,dtm_created,bit_caregiver,bit_client) values('${
      params.str_reason
    }','${params.str_createdBy}','${createdDate}','${params.bit_caregiver}','${
      params.bit_client
    }')`;
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
   * add a new Physician
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addPhysician(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; insert into dbo.physician(PhysicianName,Address1,Address2,City,State,Zip,Phone,Fax,AltPhone,Notes,Email,createdBy,created)
        values('${params.PhysicianName}','${params.Address1}','${params.Address2}','${
      params.City
    }','${params.State}','${params.Zip}',
        '${params.Phone}','${params.Fax}','${params.AltPhone}','${params.Notes}','${
      params.Email
    }','${params.createdBy}','${createdDate}')`;
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
   * add a new Client Type
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addClientType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; insert into dbo.ClientType(Name,quickBooksId,shortDescr,createdBy,created) values('${
      params.Name
    }','${params.quickBooksId}','${params.shortDescr}','${params.createdBy}','${createdDate}')`;
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
   * add a new Service
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addService(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.services(Description, ItemTypeId,createdBy)
            values('${params.Description}','1', '${params.createdBy}')`;
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
   * add a new Service
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  updateService(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update  dbo.services SET Description = '${
      params.Description
    }', updatedBy='${params.updatedBy}' WHERE ServiceCode= ${params.ServiceCode}`;
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
   * add a new client  Note Type
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addClientNoteType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; insert into dbo.clientNoteType(description,createdBy,created) values('${
      params.description
    }','${params.createdBy}','${createdDate}')`;
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
   * add a new client  Note Type
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  updateClientNoteType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; update dbo.clientNoteType SET description='${
      params.description
    }',updatedBy='${params.updatedBy}',created='${createdDate}' WHERE noteTypeID=${
      params.noteTypeID
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

  /**
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteClientNoteType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.clientNoteType  WHERE noteTypeID=${
      params.id
    } and (select count(*) from dbo.clientNotes where noteTypeID=${params.id} )=0 `;

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
   * add a new client  Note Type
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addCaregiverNoteType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; insert into dbo.caregiverNoteType(description,createdBy,created) values('${
      params.description
    }','${params.createdBy}','${createdDate}')`;

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
   * add a new client  Note Type
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  updateCaregiverNoteType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; update dbo.caregiverNoteType SET description='${
      params.description
    }',updatedBy='${params.updatedBy}',created='${createdDate}' WHERE noteTypeID=${
      params.noteTypeID
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

  /**
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteCaregiverNoteType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.caregiverNoteType  WHERE noteTypeID=${
      params.id
    }  `;

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
   * add a new class name
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addClassName(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.class(className,classListId,createdBy,created) values('${
      params.className
    }','${params.classListId}','${params.createdBy}','${createdDate}')`;

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
   * add a new classification
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addClassification(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.classification(Description,createdBy,created) values('${
      params.Description
    }','${params.createdBy}','${createdDate}')`;

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
   * add a new classification
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addCounty(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.switch_county(county,createdBy,created) values('${
      params.county
    }','${params.createdBy}','${createdDate}')`;

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
   * update existing classification
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  updateClassification(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.classification SET Description='${
      params.Description
    }',updatedBy='${params.updatedBy}',created='${createdDate}' WHERE ClassificationID= ${
      params.ClassificationID
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

  /**
   * update existing classification
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  updateCounty(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.switch_county SET county='${
      params.county
    }',updatedBy='${params.updatedBy}' WHERE county= '${params.county}' `;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteClassification(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.classification  WHERE ClassificationID=${
      params.id
    } and (select count(*) from dbo.employee where ClassificationID=${params.id})=0`;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteCounty(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    const sqlQuery = `use [${division_db}] ; delete dbo.switch_county  WHERE county='${
      params.id
    }' and (select count(*) from dbo.client where County='${
      params.id
    }')=0 and (select count(*) from dbo.employee where County='${params.id}')=0`;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addCaseManager(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.casemanager(FirstName, LastName,ExT,Phone,Fax,email,phone2,createdBy,created)
        values('${params.FirstName}','${params.LastName}','${params.ExT}','${params.Phone}','${
      params.Fax
    }',
        '${params.email}','${params.phone2}','${params.createdBy}','${createdDate}')`;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  updateCaseManager(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.casemanager SET FirstName = '${
      params.FirstName
    }', LastName='${params.LastName}',ExT = '${params.ExT}',Phone ='${params.Phone}',Fax = '${
      params.Fax
    }',email='${params.email}',phone2='${params.phone2}',updatedBy='${
      params.createdBy
    }',lastUpdated = '${createdDate}' WHERE CaseManagerId=${params.id}`;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteCaseManager(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.casemanager  WHERE CaseManagerId=${
      params.id
    } and (select count(*) from dbo.client where CaseManagerId=${params.id})=0`;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteClientType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.ClientType  WHERE clientTypeID=${
      params.id
    } and (select count(*) from dbo.client where clientTypeID=${params.id})=0`;

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
   * add a new case manager
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  deleteService(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.services  WHERE ServiceCode=${
      params.id
    } and (select count(*) from dbo.schedules where ServiceCode=${params.id})=0`;

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
   * add a new classification
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addNewReminder(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.Reminders(description,createdBy,created,caregivers,client) values('${
      params.description
    }','${params.createdBy}','${createdDate}','${params.caregivers}','${params.client}')`;

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

  // 28-03-18
  // tp start code for update master list data

  // for update Reason
  updateRreminder(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.Reminders set
            description='${params.description}',updatedBy='${params.updatedBy}',
            lastUpdated='${createdDate}',caregivers='${params.caregivers}',
            client='${params.client}' where created='${params.dtm_created}'`;

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
  // for update Reason
  updateReason(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    let dtm_created = new Date(params.dtm_created)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; update dbo.tbl_reasons set str_reason='${
      params.str_reason
    }',str_updatedBy='${params.str_updatedBy}',dtm_lastUpdated='${createdDate}',bit_caregiver='${
      params.bit_caregiver
    }',bit_client='${params.bit_client}' where dtm_created='${dtm_created}'`;

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

  // // for update Client type
  updateClientType(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();

    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');

    const sqlQuery = `use [${division_db}] ; update dbo.ClientType set Name='${
      params.Name
    }',quickBooksId='${params.quickBooksId}',shortDescr='${params.shortDescr}',updatedBy='${
      params.updatedBy
    }',lastUpdated='${createdDate}' where clientTypeID=${params.clientTypeID}`;

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

  // for update Physician
  updatePhysician(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();

    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.physician set PhysicianName='${
      params.PhysicianName
    }',Address1='${params.Address1}',
        Address2='${params.Address2}',City='${params.City}',State='${params.State}',Zip='${
      params.Zip
    }',
        Phone='${params.Phone}',Fax='${params.Fax}',AltPhone='${params.AltPhone}',Notes='${
      params.Notes
    }',
        Email='${params.Email}',updatedBy='${params.updatedBy}' where created='${params.created}'`;

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
  // cpde for delete reason/status
  deletePhysician(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.physician  WHERE PhysicianName='${
      params.PhysicianName
    }' and (select count(*) from dbo.client where Physician='${params.PhysicianName}')=0`;

    self.db
      .request()
      .query(sqlQuery)
      .then(result => {
        //
        deferred.resolve(result);
      })
      .catch(err => {
        console.error(err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  // cpde for delete reason/status
  deleteReasonStatus(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.tbl_reasons  WHERE str_reason='${
      params.str_reason
    }' and (select count(*) from dbo.client where str_reason='${params.str_reason}')=0`;

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

  //for delete reminder
  deleteReminder(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ;  delete dbo.Reminders  WHERE description='${
      params.description
    }'  and (select count(*) from dbo.clientReminders where description='${
      params.description
    }')=0 and (select count(*) from dbo.employeeExpirations where description='${
      params.description
    }')=0`;
    //   const sqlQuery = `use [${division_db}] ; delete dbo.Reminders  WHERE description='${params.description}'`;

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
   * get Agencies
   * @param {string} none
   * @return {Promise} resolve status
   */
  getAgenciesData(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.agency ORDER BY created DESC`;

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
  /**
   * get skill
   * @param {string} none
   * @return {Promise} resolve status
   */
  getSkillsData(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.skills ORDER BY  SkillId`;

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
  /**
   * get Paors
   * @param {string} none
   * @return {Promise} resolve status
   */
  getPayorsData(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.payor ORDER BY  PayorId`;

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

  /**
   * add a new Agency
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addNewAgency(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.agency(AgencyName,Address1,Address2,City,State,Zip,createdBy,created)
         values('${params.AgencyName}','${params.Address1}','${params.Address2}','${params.City}',
         '${params.State}','${params.Zip}','${params.createdBy}','${createdDate}')`;

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
  // for update Agencies
  updateAgencies(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.agency set
        AgencyName='${params.AgencyName}',Address1='${params.Address1}',
        lastUpdated='${createdDate}',Address2='${params.Address2}',
        State='${params.State}',Zip='${params.Zip}',
         City='${params.City}' where created='${params.dtm_created}'`;

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
   * add a new Skills
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addNewSkill(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.skills(Description,createdBy,created)
         values('${params.Description}','${params.createdBy}','${createdDate}')`;

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
   * add a new payors
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addNewPayor(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.payor(BAddress1,BAddress2,BCity,BState,BZip,notes,createdBy,created)
         values('${params.BAddress1}','${params.BAddress2}','${params.BCity}','${params.BState}',
         '${params.BZip}','${params.notes}','${params.createdBy}','${createdDate}')`;

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
  // for update payor
  updatePayors(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.payor set
        BAddress1='${params.BAddress1}',updatedBy='${params.updatedBy}',
        lastUpdated='${createdDate}',BAddress2='${params.BAddress2}',BCity='${
      params.BCity
    }',BState='${params.BState}',BZip='${params.BZip}',notes='${params.notes}' where PayorId='${
      params.PayorId
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

  // for update  skill
  updateSkills(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.skills set
        Description='${params.Description}',updatedBy='${params.updatedBy}',
        lastUpdated='${createdDate}' where SkillId='${params.SkillId}'`;

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
   * get Referral Resources
   * @param {string} none
   * @return {Promise} resolve status
   */
  getReferralResData(division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date().toLocaleDateString('en-US');
    const sqlQuery = `use [${division_db}] ; SELECT * FROM dbo.SHReferralTypeMaster ORDER BY  int_typeID`;

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

  /**
   * add a new Referral Resource
   * @param {string} params - params
   * @return {Promise} resolve status
   */
  addNewReferralResouce(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; insert into dbo.SHReferralTypeMaster(str_Description)
         values('${params.str_Description}')`;

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

  // for update  skill
  updateReferralRes(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; update dbo.SHReferralTypeMaster set
            str_Description='${params.str_Description}' where int_typeID=${params.int_typeID}`;

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

  //for delete payor
  deletePayor(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.payor  WHERE PayorId='${
      params.PayorId
    }' and (select count(*) from dbo.client where PayerId='${params.PayorId}')=0`;

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
  //for delete referral res
  deleteReferralRes(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.SHReferralTypeMaster  WHERE int_typeID='${
      params.int_typeID
    }' `;

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
  //for delete agencies
  deleteAgency(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.agency  WHERE AgencyName='${
      params.AgencyName
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
  //for delete skill
  deleteSkill(params, division_db, token) {
    const self = this;
    const deferred = Q.defer();
    let createdDate = new Date()
      .toISOString()
      .replace(/T/, ' ') // replace T with a space
      .replace(/\..+/, '');
    const sqlQuery = `use [${division_db}] ; delete dbo.skills  WHERE SkillId='${params.SkillId}'`;

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

module.exports = MasterFormModel;
