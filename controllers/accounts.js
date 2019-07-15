/* eslint-disable no-unused-vars */
const { Router } = require('express');

const accountsSignup = require('./accounts-signup');
const accountsForgotten = require('./accounts-forgotten');
const accountsLogin = require('./accounts-login');
const accountsLogged = require('./accounts-logged');
const accountsNotifications = require('./accounts-notifications');
const accountsConfirm = require('./accounts-confirm');

const server = Router();

server.get('/signup', accountsSignup.showSignupForm);
server.post('/signup', accountsSignup.processSigningUp);

server.get('/forgotten-password', accountsForgotten.forgottenForms);
server.post('/forgotten-password', accountsForgotten.forgottenProcessing);

server.get('/login', accountsLogin.showLoginForm);
server.post('/login', accountsLogin.processLoginTry);

server.get('/account', accountsLogged.showLoggedScreen);

server.post('/account/modify-notification', accountsNotifications.modify);
server.post('/account/delete-notification', accountsNotifications.delete);
server.get('/account/add-notification', accountsNotifications.showAddForm);
server.post('/account/add-notification', accountsNotifications.processAdding);

server.get('/account/settings', accountsLogged.showSettingsForms);
server.post('/account/settings', accountsLogged.changeSettings);

server.get('/account/contact', accountsLogged.showContactForm);
server.post('/account/contact', accountsLogged.sendContact);

server.get('/logout', accountsLogged.logoutUser);

server.get('/account/confirm', accountsConfirm.tryIt);

exports.routes = server;
