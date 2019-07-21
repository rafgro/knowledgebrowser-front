const express = require('express');
const loaders = require('./loaders');
const config = require('./config');

const stats = require('./stats');
const feedGenerator = require('./feedGenerator');
const allFeeds = require('./config/feeds');

async function startServer() {
  const server = express();

  await loaders.loaderInit(server);

  server.listen(config.conf.port, (err) => {
    if (err) {
      console.log(err);
    }
    const today = new Date();
    console.log(`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} server listening on: ${config.conf.port}`);

    // initial generators
    stats.doYourJob();
    feedGenerator.doYourJob('week');
    allFeeds.listOfFeeds.forEach((v, index) => {
      // eslint-disable-next-line no-unused-vars
      setTimeout(_ => feedGenerator.doYourJob(v.name), 3000 * index);
    });
  });
}

startServer();
