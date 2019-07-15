// eslint-disable-next-line no-unused-vars
const expressLoader = require('./express');

async function init(expressApp) {
  await expressLoader.expressInit(expressApp);
  console.log('Express intialized');
}

exports.loaderInit = init;
