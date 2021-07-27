const winston = require('winston');
const _ = require('lodash');
const fs = require('fs');

// Default environment
const env = process.env.NODE_ENV || 'development';

// Default config
const defaultConfig = {
  exitOnError: false,
  componentName: '[UNKNOWN]',
  ignoreUrlMask: '.(gif|jpe?g|png|css|less|js)$',
  writeToDisk: false,
  writeToConsole: {
    enabled: true,
    colorize: false
  },
  prependTimestamp: true,
  level: env === 'development' ? 'debug' : 'info'
};

const formatTransaction = function(message, tokens) {
  const entry = [];

  for (let i in tokens) {
    //ignore adding an entry of the one function on the object
    //message is set below the for loop
    if (i === 'setException' || i === 'message') {
      continue;
    }
    if (_.isDate(tokens[i])) {
      entry.push(`${i}="${tokens[i].toISOString()}"`);

      entry.push(`${i}="${tokens[i]}"`);
    }
  }

  //set the passed in message
  if (!_.isEmpty(message)) {
    entry.push(`message="${message}"`);
  }
  //or existing message if one is not passed in
  else if (tokens.message) {
    entry.push(`message="${tokens.message}"`);
  }
  return entry.join(' ');
};

const Logger = function(configuration) {
  let config;
  let formatter;

  // Merge passed in config with default config to avoid any init issues
  if (configuration) {
    config = _.merge(defaultConfig, configuration);
  } else {
    config = defaultConfig;
  }

  config.ignoreUrlMask = new RegExp(config.ignoreUrlMask);

  this.config = config;

  // Formatter passed to the Winston constructor
  if (config.prependTimestamp) {
    formatter = function(args) {
      return args.timestamp() + ' ' + args.level.toUpperCase() + ' ' + args.message;
    };
  } else {
    formatter = function(args) {
      return args.level.toUpperCase() + ' ' + args.message;
    };
  }

  // New instance of Winston logger
  this.logger = new winston.Logger({exitOnError: config.exitOnError || false});
  this.priorityOrder = this.logger.levels.info > this.logger.levels.error ? -1 : 1;

  if (config.writeToDisk) {
    //Create the log folder if it does not exist
    if (!fs.existsSync(config.logFolder)) {
      fs.mkdirSync(config.logFolder);
    }

    this.logger.add(winston.transports.DailyRotateFile, {
      name: 'access-log',
      level: config.level,
      filename:
        config.logFolder +
        '/' +
        (config.componentName === '[UNKNOWN COMPONENT]'
          ? 'unknownComponent'
          : config.componentName) +
        '_access',
      showLevel: false,
      handleExceptions: config.exceptionLog ? false : true,
      exitOnError: false,
      json: false,
      maxsize: config.accessLog.maxSize,
      maxFiles: config.accessLog.maxFiles,
      colorize: false,
      timestamp: function() {
        return new Date().toISOString();
      },
      datePattern: '-yyyy-MM-dd.log',
      formatter: formatter
    });
  }

  if (config.exceptionLog) {
    this.logger.add(winston.transports.DailyRotateFile, {
      name: 'error-log',
      level: 'error',
      filename: (config.logFolder || './logs') + '/' + config.componentName + '_error',
      showLevel: false,
      handleExceptions: true,
      exitOnError: false,
      json: false,
      maxsize: config.exceptionLog.maxSize,
      maxFiles: config.exceptionLog.maxFiles,
      colorize: false,
      timestamp: function() {
        return new Date().toISOString();
      },
      datePattern: '-yyyy-MM-dd.log',
      formatter: this.formatter
    });
  }

  if (config.writeToConsole && config.writeToConsole.enabled) {
    this.logger.add(winston.transports.Console, {
      level: config.level,
      timestamp: function() {
        return new Date().toISOString();
      },
      showLevel: true,
      handleExceptions: true,
      json: false,
      colorize: config.writeToConsole.colorize,
      formatter: formatter
    });
  }

  //create sugar functions for different logging levels (info and error are special due to error_message override)
  _.forEach(this.logger.levels, function(val, lvl) {
    if (lvl !== 'info' && lvl !== 'error') {
      Logger.prototype[lvl] = function(message, tokens, levelOverride) {
        return this.log(lvl, message, tokens, levelOverride);
      };
    }
  });
};

Logger.prototype.setLevel = function(level) {
  this.logger.level = level;
  this.config.level = level;

  _.forEach(this.logger.transports, function(item) {
    if (item.level) {
      item.level = level;
    }
  });
};

Logger.prototype.info = function(message, tokens) {
  if (tokens && tokens.error_message) {
    this.logger.warn(formatTransaction(message, tokens));

    this.logger.info(formatTransaction(message, tokens));
  }
};

Logger.prototype.log = function(level, message, tokens, levelOverride) {
  let result;
  let lvl = null;
  if (levelOverride) {
    lvl = this.logger.level;
    this.setLevel(levelOverride);
  }

  this.logger.log(level, formatTransaction(message, tokens));

  // Check, if message was logged.
  result =
    (this.logger.levels[level] - this.logger.levels[this.logger.level]) * this.priorityOrder >= 0;

  if (levelOverride) {
    this.setLevel(lvl);
  }

  return result;
};

Logger.prototype.error = function(message, stack, tokens) {
  if (!tokens) {
    tokens = {};
  }
  if (stack && stack !== null) {
    tokens.error_stack = stack;
  }
  if (message && message !== null) {
    tokens.error_message = message;
  }
  this.logger.error(formatTransaction(null, tokens));
}; // cyclomatic complexity

/* jshint -W074 */ Logger.prototype.setException = function(err, tokens) {
  if (typeof err === 'function') {
    return;
  }

  if (typeof err === 'string' || err instanceof String || typeof err === 'number') {
    tokens.error_message = err;
    return;
  }

  if (err instanceof Array) {
    tokens.error_message = err.join(',');
    return;
  }

  //Special handling for Error object
  if (err instanceof Error) {
    Object.getOwnPropertyNames(err).forEach(function(key) {
      if (typeof err[key] === 'object') {
        tokens['error_' + key] = JSON.stringify(err[key]);
      } else if (typeof err[key] !== 'function') {
        tokens['error_' + key] = err[key];
      }
    });
    tokens.error_type = err.constructor.name;
    return;
  }

  if (typeof err === 'object') {
    for (let prop in err) {
      //ignore adding a entry of the one function on the object
      if (typeof err[prop] === 'function') {
        continue;
      }

      if (
        typeof err[prop] === 'string' ||
        err[prop] instanceof String ||
        typeof err[prop] === 'number'
      ) {
        tokens['error_' + prop.toString()] = err[prop];
      } else if (err[prop] instanceof Array) {
        if (
          prop
            .toString()
            .toLowerCase()
            .indexOf('stack') > -1
        ) {
          tokens['error_' + prop.toString()] = err[prop].join('\n\t');
        } else {
          tokens['error_' + prop.toString()] = err[prop].join(',');
        }
      } else {
        try {
          tokens['error_' + prop.toString()] = JSON.stringify(err[prop]).replace(/"/g, "'");
        } catch (e) {}
      }
    }
    return;
  }
};

module.exports = Logger;
