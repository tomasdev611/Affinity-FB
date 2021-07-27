const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const pool = function pool() {
  return {
    getDb: () => this.db,
    init: dbConfig => {
      const auth = dbConfig.username ? `${dbConfig.username}:${dbConfig.password}@` : '';
      const hosts = dbConfig.hosts.join(',');
      const url = `mongodb://${auth}${hosts}/${dbConfig.database}`;

      const p = new Promise((resolve, reject) => {
        MongoClient.connect(
          url,
          dbConfig.connectionOptions,
          (err, database) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            this.db = database;
            resolve();
          }
        );
      });
      return p;
    }
  };
};

module.exports = pool();
