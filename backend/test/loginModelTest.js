const database = require('./../lib/databasemssql');
const Login = require('./../models/login');
const confit = require('confit');
const path = require('path');

confit(path.join(__dirname, './../config')).create((confitErr, config) => {
  const dbConfig = config.get('mssql');
  database.init(dbConfig).then(() => {
    const login = new Login();
    login
      .generateTokenDb('sandie', 'bobooo')
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(`ERROR---> :${err}`);
      });
  });
});
