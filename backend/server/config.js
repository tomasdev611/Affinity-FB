/* eslint-disable no-unused-vars */
import path from 'path';
import merge from 'lodash/merge';

/* istanbul ignore next */
const requireProcessEnv = name => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
};

// }

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 3001,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    rootUrl: process.env.ROOT_URL || 'http://localhost:9000',
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    ipRestriction: process.env.IP_RESTRICTION,
    tempFolderPath: process.env.TEMP_DIRECTORY,
    logType: process.env.LOG_TYPE || 'disable',
    googleApiKey: process.env.GOOGLE_API_KEY,
    aws: {
      awsBucketName: process.env.AWS_BUCKET_NAME,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY
    },
    mssql: {
      user: process.env.MSSQL_USERNAME,
      password: process.env.MSSQL_PASSWORD,
      server: process.env.MSSQL_SERVER,
      port: process.env.MSSQL_PORT,
      pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000
      }
    },
    twilio: {
      accountSID: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      groupNotifySID: process.env.TWILIO_GROUP_NOTIFY_SERVICE_SID,
      groupServiceSID: process.env.TWILIO_GROUP_MESSAGE_SERVICE_SID,
      individualNotifySID: process.env.TWILIO_INDIVIDUAL_NOTIFY_SERVICE_SID,
      individualServiceSID: process.env.TWILIO_INDIVIDUAL_MESSAGE_SERVICE_SID,
      defaultNumber: process.env.TWILIO_DEFAULT_NUMBER
    },
    kraken: {
      middleware: {
        devtools: {
          enabled: true,
          priority: 35,
          module: {
            name: 'construx',
            arguments: [
              'path:./public',
              'path:./.build',
              {
                css: {
                  module: 'construx-less',
                  files: '/css/**/*.css'
                },
                copier: {
                  module: 'construx-copier',
                  files: '**/*'
                }
              }
            ]
          }
        },
        static: {
          module: {
            arguments: ['path:./.build']
          }
        },
        cors: {
          enabled: true,
          priority: 119,
          module: {
            name: 'path:./lib/middleware/cors'
          }
        },
        appsec: {
          enabled: false
        },
        router: {
          module: {
            arguments: [{directory: 'path:./controllers'}]
          }
        }
      }
    }
  },
  test: {},
  development: {},
  production: {}
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
