/* eslint-disable no-unused-vars */
const userApi = require('../userApi');

// 1 - get forgotten without query, accessible from login (forgottenForms)
// 2 - post forgotten to api which send email             (forgottenProcessing)
// 3 - get forgotten with query, clicked by mail          (forgottenForms)
// 4 - post forgotten to api with query                   (forgottenProcessing)

exports.forgottenForms = function (request, response) {
  if (request.query.key == undefined) {
    // 1
    response.render('forgotten', { layout: 'pseudomodal', title: 'Forgotten password - kb:preprints' });
    return;
  } else {
    // 3
    response.render('forgotten2', { layout: 'pseudomodal', title: 'Forgotten password - kb:preprints', error: '<span style="color:black !important">Enter your new password.</span>', appendix: `?key=${request.query.key}` });
    return;
  }
};

exports.forgottenProcessing = function (request, response) {
  if (request.query.key == undefined) {
    // 2
    userApi.forgottenPassword(request.body.email)
      .then(() => {
        response.render('forgotten', { layout: 'pseudomodal', title: 'Forgotten password - kb:preprints', error: '<span style="color:black !important">Mail sent.</span>' });
        return;
      })
      .catch((e) => {
        response.render('forgotten', { layout: 'pseudomodal', title: 'Forgotten password - kb:preprints', error: 'Sorry, we\'ve encountered an error.' });
        return;
      });
  } else {
    // 4
    // eslint-disable-next-line no-lonely-if
    if (request.body.pass != request.body.pass2) {
      response.render('forgotten2', { layout: 'pseudomodal', title: 'Forgotten password - kb:preprints', error: 'Provided passwords are different.', appendix: `?key=${request.query.key}` });
      return;
    } else {
      userApi.forgottenPassword2(request.query.key, request.body.pass)
        .then(() => {
          response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', error: '<span style="color:black !important">Password changed, please log in using new credentials.</span>' });
          return;
        })
        .catch((e) => {
          response.render('forgotten2', { layout: 'pseudomodal', title: 'Forgotten password - kb:preprints', error: 'Sorry, we\'ve encountered an error.', appendix: `?key=${request.query.key}` });
          return;
        });
    }
  }
};
