import config from './config';
import express from 'express';
const kraken = require('kraken-js');
const database = require('./lib/databasemssql');
const {knexPool} = require('./lib/knexPool');
// const Logger = require('./lib/logger');
const app = (module.exports = express());
// const port = process.env.PORT || 3000;
const http = require('http');
// const path = require('path');
// const fs = require('fs');
// const confit = require('confit');
// const https = require('https');

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
// database.init(config.mssql)
// .then(() => {
//     next(null, config);
// });
const options = {
  onconfig: function(config1, next) {
    /*
     * Add any additional config setup or overrides here. `config` is an initialized
     * `confit` (https://github.com/krakenjs/confit/) configuration object.
     */
    // const logger = new Logger(config.get('middleware').logger.module.arguments[0]);
    // logger.info(`Application started: ${app.kraken.get('env:env')} .....`);
    // const db_server = config.get('db');
    // database.init(config.get('mssql'+db_server))
    //     .then(() => {
    //         next(null, config);
    //     });
    database.init(config.mssql).then(() => {
      next(null, config1);
    });

    knexPool.init();
  }
};
// app = module.exports = express();
//app.use(cors());
app.use(kraken(options));
// app.listen(port);
app.on('start', function() {
  console.log('Application ready to serve requests.');
  console.log('Environment: %s', app.kraken.get('env:env'));
});

let server = http.createServer(app);
setImmediate(() => {
  server.listen(config.port, config.ip, () => {
    console.log(
      'Express server listening on http://%s:%d, in %s mode',
      config.ip,
      config.port,
      config.env
    );
  });
});

// server.listen(port);
// server.on('listening', (() => {
//   console.warn(`Server listening on port ${port}`);
// }));
