/* eslint-disable global-require */
// eslint-disable-next-line no-unused-vars
const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
// const useragent = require('device');

const config = require('../config');
const routes = require('../routes');
const ctrlPreprints = require('../controllers/preprints');
const ctrlAccounts = require('../controllers/accounts');
const ctrlInternal = require('../controllers/internal');
const userApi = require('../userApi');

async function doJob(app) {
  app.set('port', config.conf.port);
  app.enable('trust proxy');

  // View engine
  app.engine('handlebars', exphbs({
    helpers: {
      if_eq: (a, b, opts) => {
        if (a == b) { return opts.fn(this); } else { return opts.inverse(this); }
      },
    },
  }));
  app.set('view engine', 'handlebars');

  // Static files
  app.use('/assets', express.static('assets'));
  app.use(express.static(__dirname));

  // Passport
  const localStrategy = require('passport-local').Strategy;
  app.use(require('cookie-parser')());
  app.use(session({
    secret: 'keyboard cat', resave: false, saveUninitialized: false, cookie: { secure: false, withCredentials: true },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(require('body-parser').urlencoded({ extended: true }));

  // Passport conf
  // eslint-disable-next-line new-cap
  passport.use('local', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, (req, username, password, done) => {
    userApi.login(username, password)
      .then(() => {
        console.log('logged');
        done(null, [{ email: username }]);
      })
      .catch((e) => {
        console.log('not logged');
        console.log(e);
        done(e);
      });
  }));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // Load routes
  app.use('/preprints/', ctrlPreprints.routes);
  app.use('/', ctrlAccounts.routes);
  app.use('/', ctrlInternal.routes);
  app.use('/', routes.routesServer);

  // Internal errors
  process.on('unhandledRejection', r => console.log(r));

  // Return the express app
  return app;
}

exports.expressInit = doJob;
