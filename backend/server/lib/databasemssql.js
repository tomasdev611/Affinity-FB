const sql = require('mssql');
const Q = require('q');

// const pool = function pool() {
//     return {
//         getDb: () => this.db,
//         init: (dbConfig) => {
//             const deferred = Q.defer();
//             sql.promise = require('q');
//             sql.connect(dbConfig)
//                 .then((pool) => {
//                     this.db = pool;
//                     console.log('DB initialized');
//                     deferred.resolve();
//                 })
//                 .catch((error) => {
//                     console.error(`Error on db init: ${error}`);
//                     deferred.reject(error);
//                 });
//             return deferred.promise;
//         }
//     };
// };
class DbPool {
  getDb() {
    return this.db;
  }
  init(dbConfig) {
    const deferred = Q.defer();
    sql.promise = require('q');
    sql
      .connect(dbConfig)
      .then(pool => {
        this.db = pool;
        console.log('DB initialized');
        deferred.resolve();
      })
      .catch(error => {
        console.error(`Error on db init: ${error}`);
        deferred.reject(error);
      });
    return deferred.promise;
  }
}

module.exports = new DbPool();
