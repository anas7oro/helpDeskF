// logger.js
const winston = require('winston');
const logsSchema = require('../models/logs.js');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Custom transport that writes error messages to the database
const Transport = require('winston-transport');

// Custom transport that writes error messages to the database
class DbTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.name = 'DbTransport';
    this.level = opts.level;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (info.level === 'error') {
      const log = new logsSchema({
        level: info.level,
        errorMessage: info.message, // change 'message' to 'errorMessage'
        userId: info.userId, //  // add userId to the log
        timestamp: new Date()
      });

      log.save()
        .then(() => callback(null, true))
        .catch(err => callback(err));
    } else {
      callback(null, true);
    }
  }
}
logger.add(new DbTransport({ level: 'error' }));

// Middleware that adds a log method to the req object
function logMiddleware(req, res, next) {
  req.log = function(level, message) {
    logger.log({
      level: level,
      message: message,
      userId: req.user._id 
    });
  };

  next();
};

module.exports = { logger, logMiddleware };
