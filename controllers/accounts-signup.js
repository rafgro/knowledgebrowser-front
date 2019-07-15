/* eslint-disable no-unused-vars */
const passport = require('passport');
const userApi = require('../userApi');

// Form showed to user who wants to create an account

exports.showSignupForm = function (request, response) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = `?for=${request.query.for}`;
  if (request.isAuthenticated()) {
    return response.redirect(`/account${forWhat}`);
  } else {
    response.render('register', { layout: 'pseudomodal', title: 'Sign up - kb:preprints', forWhat: request.query.for });
    return;
  }
};

// Processing everything that user entered and send to create an account

exports.processSigningUp = function (request, response, next) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = `?for=${request.query.for}`; // signing up for updates

  // simple checks
  if (request.body.password != request.body.password2) {
    response.render('register', { layout: 'pseudomodal', title: 'Sign up - kb:preprints', error: 'Provided passwords are different.', email: request.body.email, forWhat: request.query.for });
    return;
  }
  if (request.body.password.length < 6) {
    response.render('register', { layout: 'pseudomodal', title: 'Sign up - kb:preprints', error: 'Please enter password longer than 5 characters.', email: request.body.email, forWhat: request.query.for });
    return;
  }

  // call to api on external server
  userApi.signup(request.body.email, request.body.password, request.query.for)
    .then((r) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.log('1');
          console.log(err);
          response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', error: 'Sorry, we\'ve encountered an error.', email: request.body.email, forWhat: request.query.for });
          return;
        }
        request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        request.login([{ email: request.body.email }], (err2) => {
          if (err2) {
            console.log('2');
            console.log(err2);
            response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', error: 'Sorry, we\'ve encountered an error.', email: request.body.email, forWhat: request.query.for });
            return;
          } else {
            // successful login
            return response.redirect(`/account${forWhat}`);
          }
        });
      })(request, response, next);
    })
    .catch((e) => {
      // eslint-disable-next-line no-param-reassign
      if (typeof e != 'object') e = JSON.parse(e);
      response.render('register', { layout: 'pseudomodal', title: 'Sign up - kb:preprints', error: e.message, email: request.body.email, forWhat: request.query.for });
      return;
    });
};
