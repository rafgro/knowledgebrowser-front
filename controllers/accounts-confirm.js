const userApi = require('../userApi');

exports.tryIt = function (request, response) {
  userApi.confirmUser(request.query.mail)
    .then(() => {
      response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', forWhat: request.query.for, error: '<span style="color:#03a903 !important">Thank you, mail confirmed!</span>' });
      return;
    })
    // eslint-disable-next-line no-unused-vars
    .catch((e) => {
      response.render('login', { layout: 'pseudomodal', title: 'Login - kb:preprints', forWhat: request.query.for, error: 'Sorry, we cannot confirm your mail.' });
      return;
    });
};
