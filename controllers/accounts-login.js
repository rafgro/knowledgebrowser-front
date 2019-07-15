/* eslint-disable no-unused-vars */
const passport = require('passport');

// Just showing login for get request

exports.showLoginForm = function (request, response) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = `?for=${request.query.for}`;
  if (request.isAuthenticated()) {
    return response.redirect(`/account${forWhat}`);
  } else {
    response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', forWhat: request.query.for });
    return;
  }
};

// Authorizing user after post request

exports.processLoginTry = function (request, response, next) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = `?for=${request.query.for}`;
  if (request.body.email.length < 1 || request.body.password.length < 1) {
    response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', error: 'Please enter your credentials.', forWhat: request.query.for });
    return;
  } else {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.log(err);
        response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', error: err.message, email: request.body.email, forWhat: request.query.for });
        return;
      } else {
        request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        request.login(user, (err2) => {
          if (err2) {
            console.log(err2);
            response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', error: 'Sorry, we\'ve encountered an error.', email: request.body.email, forWhat: request.query.for });
            return;
          } else {
            return response.redirect(`/account${forWhat}`);
          }
        });
      }
    })(request, response, next);
  }
};
