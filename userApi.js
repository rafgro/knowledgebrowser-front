const request = require('request');

exports.signup = function (email, pass, firstNotification) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/createuser',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', email, pass, firstNotification },
          timeout: 5000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve('pozitive');
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.login = function (email, pass, newNotification) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/loginuser',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', email, pass, newNotification },
          timeout: 5000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve('pozitive');
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.getAllNotifications = function (email) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/allnotifications',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', email },
          timeout: 10000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (body.length == 2) reject({ errorType: 'empty', message: 'Empty!'});
      if (res.statusCode == 200) resolve(body);
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.addOneNotification = function (account, keywords, relevance, frequency, where) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/addonenotification',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', account, keywords, relevance, frequency, where },
          timeout: 10000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve(body);
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.updateNotification = function (account, keywords, relevance, frequency, where, created, hiddenid) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/updatenotification',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', account, keywords, relevance, frequency, where, created, hiddenid },
          timeout: 10000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve(body);
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.deleteNotification = function (account, hiddenid) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/deletenotification',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', account, hiddenid },
          timeout: 10000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve(body);
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.confirmUser = function (key) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/confirmuser',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', key },
          timeout: 10000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve(body);
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.getMailStatus = function (email) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/usermailstatus',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', email },
          timeout: 10000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve(body);
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.changeMail = function (oldmail, pass, newmail) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/changeusermail',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', oldmail, pass, newmail },
          timeout: 5000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve('pozitive');
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};

exports.changePass = function (mail, oldpass, newpass) {
  return new Promise( (resolve, reject) => {
    request.post('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/accounts/changeuserpass',
      {
          form: { hey: 'ZXVUXb96JPgZVspA', mail, oldpass, newpass },
          timeout: 5000
      }, (error, res, body) => {
      if (error) reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
      if (res.statusCode == 200) resolve('pozitive');
      else {
        try { 
          const what = JSON.parse(body);
          reject(what);
        } catch(e) {
          reject({ errorType: 'server', message: 'Sorry, we\'ve encountered an error.' });
        }
      }
    })
  });
};
