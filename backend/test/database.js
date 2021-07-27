const database = require('./../lib/databasemssql');
const confit = require('confit');
const path = require('path');

confit(path.join(__dirname, './../config')).create((confitErr, config) => {
  const dbConfig = config.get('mssql');
  database.init(dbConfig).then(() => {
    const sql = database.getDb();
    sql.query`select * from Monroe_A.dbo.securityUsers where userName='sandie' AND userPassword='bobooo'`
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(`Error ${err}`);
      });
  });
});
