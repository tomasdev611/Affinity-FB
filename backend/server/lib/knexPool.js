const Knex = require('knex');
const {Model} = require('objection');
const config = require('../config');

const knexTinyLogger = require('knex-tiny-logger').default;

const ConnectionConfig = {
  client: 'mssql',
  connection: {
    host: process.env.MSSQL_SERVER,
    port: process.env.MSSQL_PORT,
    // database: process.env.DATABASE_NAME,
    user: process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD
  }
};

class KnexPool {
  knexMap = {};
  async getKnex(dbName) {
    if (this.knexMap[dbName]) {
      return this.knexMap[dbName];
    }
    const knex = Knex({
      ...ConnectionConfig,
      connection: {...ConnectionConfig.connection, database: dbName}
    });
    if (config.logType === 'log-all') {
      knexTinyLogger(knex);
    }
    this.knexMap[dbName] = knex;
    return knex;
  }
  init() {}
}

const knexPool = new KnexPool();
module.exports = {knexPool};
