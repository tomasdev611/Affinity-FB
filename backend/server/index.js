require('babel-core/register');
const path = require('path');
// /* istanbul ignore next */
// // if (process.env.NODE_ENV !== 'production') {
const dotenv = require('dotenv-safe');
dotenv.load({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example')
});

exports = module.exports = require('./app');
