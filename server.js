const express = require('express');
const loaders = require('./loaders');
const config = require('./config');

const stats = require('./stats');
const feedGenerator = require('./feedGenerator');

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
  });
}

startServer();
