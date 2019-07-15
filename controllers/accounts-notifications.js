/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
const userApi = require('../userApi');

// Modifying notification by post query

exports.modify = function (request, response) {
  if (request.isAuthenticated()) {
    if (request.body.purpose === '0') {
      // purpose 0 = showing form
      response.render('account-modifynotification', { title: 'Modify notification - kb:preprints', layout: 'accountlayout', username: request.user[0].email, created: request.body.created, query: request.body.query, minrelevance: request.body.minrelevance, frequency: request.body.frequency, where: request.body.where, hiddenid: request.body.hiddenid, createdText: request.body.createdText });
      return;
    } else if (request.body.purpose === '1') {
      // purpose 1 = applying changes
      userApi.updateNotification(request.user[0].email, request.body.query, request.body.minrelevance, request.body.frequency, request.body.where, request.body.created, request.body.hiddenid)
        .then(() => {
          return response.redirect('/account?m=sm');
        })
        .catch((e) => {
          console.log(e);
          response.render('account-modifynotification', { title: 'Modify notification - kb:preprints', layout: 'accountlayout', username: request.user[0].email, created: request.body.created, query: request.body.query, minrelevance: request.body.minrelevance, frequency: request.body.frequency, where: request.body.where, hiddenid: request.body.hiddenid, error: 'Sorry, we\'ve encountered an error.' });
          return;
        });
    }
  }
  else {
    return response.redirect('/login');
  }
};

// Deleting notification by post query

exports.delete = function (request,response) {
  if (request.isAuthenticated()) {
    if (request.body.purpose === '0') {
      // purpose 0 = showing form
      response.render('account-deletenotification', { title: 'Delete notification - kb:preprints', layout: 'accountlayout', username: request.user[0].email, query: request.body.query, hiddenid: request.body.hiddenid });
      return;
    } else if (request.body.purpose === '1') {
      // purpose 1 = applying changes
      userApi.deleteNotification(request.user[0].email, request.body.hiddenid)
        .then(() => {
          return response.redirect('/account?m=sd');
        })
        .catch((e) => {
          response.render('account-deletenotification', { title: 'Modify notification - kb:preprints', layout: 'accountlayout', username: request.user[0].email, query: request.body.query, hiddenid: request.body.hiddenid, error: 'Sorry, we\'ve encountered an error.' });
          return;
        });
    }
  }
  else {
    return response.redirect('/login');
  }
};

exports.showAddForm = function (request, response) {
  if (request.isAuthenticated()) {
    response.render('account-addnotification', { title: 'Add notification - kb:preprints', layout: 'accountlayout', username: request.user[0].email, forWhat: request.query.for });
    return;
  } else {
    return response.redirect('/login');
  }
};

exports.processAdding = function (request, response) {
  if (request.isAuthenticated()) {
    const parsed = request.body;
    userApi.addOneNotification(request.user[0].email, parsed.keyword, parsed.relevance, parsed.frequency, request.user[0].email)
      .then(() => {
        return response.redirect('/account?m=sc');
      })
      .catch((e) => {
        response.render('account-addnotification', { title: 'Add notification - kb:preprints', layout: 'accountlayout', username: request.user[0].email, forWhat: request.query.for, error: 'Sorry, we\'ve encountered an error.' });
        return;
      });
  }
  else {
    return response.redirect('/login');
  }
};
