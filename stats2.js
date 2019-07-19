
const request = require('request');
// const fs = require('fs');

exports.doYourJob = function () {
  return new Promise((resolve, reject) => {
    request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/stats2',
      { timeout: 20000 }, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          const results = JSON.parse(body);
          resolve(results);
        }
      });
  });
};
