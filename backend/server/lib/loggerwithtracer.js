const fs = require('fs');

const logger = function getLogger(loglevel) {
  return require('tracer').console({
    transport: function(data) {
      console.log(data.output);
      fs.appendFile('log/app/file.log', data.output + '\n', err => {
        if (err) throw err;
      });
    },
    inspectOpt: {
      showHidden: true, //the object's non-enumerable properties will be shown too
      depth: null //tells inspect how many times to recurse while formatting the object. This is useful for inspecting large complicated objects. Defaults to 2. To make it recurse indefinitely pass null.
    }
  });
};

module.exports = logger;

const mylogger = logger();

mylogger.log('test1');
mylogger.log('test32');
mylogger.log('test4');
mylogger.log('test5');
