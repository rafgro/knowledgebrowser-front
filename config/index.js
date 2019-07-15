/* eslint-disable linebreak-style */
process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// to handle more db connections
// eslint-disable-next-line no-underscore-dangle
// require('events').EventEmitter.prototype._maxListeners = 100;

const conf = {
  // port: process.env.PORT || 3000,
  port: process.env.PORT || 80,

};

exports.conf = conf;
