const request = require('request');

exports.signup = function (email, pass) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/createuser',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', email, pass },
          timeout: 5000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve('pozitive');
      else reject(body || { errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
    })
  });
};

exports.login = function (email, pass) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/loginuser',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', email, pass },
          timeout: 5000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve('pozitive');
      else reject(body || { errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
    })
  });
};