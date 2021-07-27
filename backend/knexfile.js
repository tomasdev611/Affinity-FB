require('dotenv').config();

module.exports = {
  development: {
    client: 'mssql',
    connection: {
      host: process.env.MSSQL_SERVER,
      port: process.env.MSSQL_PORT,
      database: process.env.DATABASE_NAME || 'shouldfail',
      user: process.env.MSSQL_USERNAME,
      password: process.env.MSSQL_PASSWORD
    },
    migrations: {
      directory: './migrations'
    }
  }
};
