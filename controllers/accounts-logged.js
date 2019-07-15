/* eslint-disable no-param-reassign */
const nodemailer = require('nodemailer');
const userApi = require('../userApi');

exports.showLoggedScreen = function (request, response) {
  if (request.query.for != undefined) {
    return response.redirect(`/account/add-notification?for=${request.query.for}`);
  }
  if (request.isAuthenticated()) {
    const messages = [];
    if (request.query.m != undefined) {
      switch (request.query.m) {
        case 'sm':
          messages.push({ color: 'success', content: 'Notification successfully modified.' });
          break;
        case 'sc':
          messages.push({ color: 'success', content: 'Notification successfully created.' });
          break;
        case 'sd':
          messages.push({ color: 'success', content: 'Notification successfully deleted.' });
          break;
        default:
      }
    }
    const fewQueries = [userApi.getAllNotifications(request.user[0].email),
      userApi.getMailStatus(request.user[0].email)];
    Promise.all(fewQueries)
      .then((res) => {
        if (res[1] != '1') {
          messages.push({ color: 'warning', content: 'You need to confirm your mail before we can send you notifications.' });
        }
        if (res[0].length < 20) {
          response.render('account', { title: 'Account - kb:preprints', layout: 'accountlayout', username: request.user[0].email, error: 'You have no notifications.', messages });
          return;
        } else {
          let parsed = JSON.parse(res[0]);
          parsed = parsed.map((value) => {
            let divided = value.query.toUpperCase().split(',');
            divided = divided.map((v) => {
              if (v.charAt(0) === ' ') return { text: v.substring(1) };
              else return { text: v };
            });
            value.queries = divided;
            switch (value.frequency) {
              case 1: value.frequencyText = 'as soon as possible'; break;
              case 2: value.frequencyText = 'max once a day'; break;
              case 3: value.frequencyText = 'max once a few days'; break;
              case 4: value.frequencyText = 'max once a week'; break;
              case 5: value.frequencyText = 'max once a few weeks'; break;
              default:
            }
            // eslint-disable-next-line prefer-template
            value.createdText = value.created.replace('T', ' ').substring(0, 16) + ' UTC';
            return value;
          });
          response.render('account', { title: 'Account - kb:preprints', layout: 'accountlayout', username: request.user[0].email, notifications: parsed, messages });
          return;
        }
      })
      .catch((e) => {
        console.log(e);
        response.render('account', { title: 'Account - kb:preprints', layout: 'accountlayout', username: request.user[0].email, error: e.message, messages });
        return;
      });
  } else {
    return response.redirect('/login');
  }
};

// Settings

exports.showSettingsForms = function (request, response) {
  if (request.isAuthenticated()) {
    response.render('account-settings', { title: 'Settings - kb:preprints', layout: 'accountlayout', username: request.user[0].email });
    return;
  } else {
    return response.redirect('/login');
  }
};

exports.changeSettings = function (request, response) {
  if (request.isAuthenticated()) {
    if (request.body.purpose == 'mail') {
      if (request.user[0].email == request.body.newmail) {
        response.render('account-settings', { title: 'Settings - kb:preprints', layout: 'accountlayout', username: request.user[0].email, messages: [{ color: 'warning', content: 'Old and new mail seem the same.' }] });
        return;
      }
      userApi.changeMail(request.user[0].email, request.body.pass, request.body.newmail)
        .then(() => {
          request.logout();
          response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', forWhat: request.query.for, error: '<span style="color:black !important">Mail changed, please log in using new credentials.</span>' });
          return;
        })
        .catch((e) => {
          console.log(e);
          response.render('account-settings', { title: 'Settings - kb:preprints', layout: 'accountlayout', username: request.user[0].email, messages: [{ color: 'warning', content: 'Sorry, we\'ve encountered an error.' }] });
          return;
        });
    } else if (request.body.purpose == 'pass') {
      if (request.body.newpass != request.body.newpass2) {
        response.render('account-settings', { title: 'Settings - kb:preprints', layout: 'accountlayout', username: request.user[0].email, messages: [{ color: 'warning', content: 'Provided new passwords are different.' }] });
        return;
      }
      userApi.changePass(request.user[0].email, request.body.oldpass, request.body.newpass)
        .then(() => {
          request.logout();
          response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', forWhat: request.query.for, error: '<span style="color:black !important">Password changed, please log in using new credentials.</span>' });
          return;
        })
        .catch((e) => {
          console.log(e);
          response.render('account-settings', { title: 'Settings - kb:preprints', layout: 'accountlayout', username: request.user[0].email, messages: [{ color: 'warning', content: 'Sorry, we\'ve encountered an error.' }] });
          return;
        });
    }
  } else {
    return response.redirect('/login');
  }
};

// Contact

exports.showContactForm = function (request, response) {
  if (request.isAuthenticated()) {
    response.render('account-contact', { title: 'Contact - kb:preprints', layout: 'accountlayout', username: request.user[0].email });
    return;
  } else {
    return response.redirect('/login');
  }
};

exports.sendContact = function (request, response) {
  const transport = nodemailer.createTransport({
    host: 'ssd3.linuxpl.com',
    port: 587,
    auth: {
      user: 'hello@knowbrowser.org',
      pass: 'X4k2MfRCmvh63kak!',
    },
  });

  const mailOptions = {
    from: '"kb:preprints" <hello@knowledgebrowser.org>',
    to: 'grochala.rafal@protonmail.com',
    subject: `Feedback from user ${request.user[0].email}`,
    text: request.body.message,
    html: request.body.message,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info);
    response.render('account-contact', { title: 'Contact - kb:preprints', layout: 'accountlayout', username: request.user[0].email, sent: 1 });
  });
};

exports.logoutUser = function (req, res) {
  req.logout();
  return res.redirect('/');
};
