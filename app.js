'use strict';

const express = require('express'),
      exphbs  = require('express-handlebars'),
      queryApi = require('./queryApi'),
      userApi = require('./userApi'),
      stats = require('./stats'),
      stats2 = require('./stats2'),
      seoSitemap = require('./seoSitemap'),
      feedGenerator = require('./feedGenerator'),
      passport = require('passport'),
      session = require('express-session');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use(express.static(__dirname));

const localStrategy = require('passport-local').Strategy;
app.use(require('cookie-parser')());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false, cookie:{secure:false, withCredentials: true} }));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('body-parser').urlencoded({ extended: true }));

/*const {shiphold} = require('ship-hold');
/*const sh = shiphold({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : 'postgres'
});
const sh = shiphold({
    host     : '127.0.0.1',
    user     : 'crawler',
    password : 'blackseo666',
    database : 'preprint-crawls'
});*/

/*app.get('*', function(req, res){
  res.render( 'preprint-sub-maintenance', { "title": "Maintenance - kb:preprints" } );
});*/

app.get('/', function(request,response) {
  response.redirect(301, 'https://knowledgebrowser.org/preprints');
});

app.get('/preprints', function(request,response) {
  response.render( 'preprint-homepage', {layout: 'homepage'} );
});

/* will go out to passport js */
passport.use('local', new localStrategy({passReqToCallback: true, usernameField: 'email'}, (req, username, password, done) => {
  userApi.login(username, password)
    .then(() => {
      console.log('logged');
      done(null, [{email: username}])
    })
    .catch((e) => {
      console.log('not logged');
      console.log(e);
      done(e);
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
 

/* ACCOUNT RELATED */
app.get('/signup', function(request,response) {
  if (request.isAuthenticated()) response.redirect('/account');
  else response.render( 'register', {layout: 'pseudomodal', "title": "Sign up - kb:preprints"} );
});
app.post('/signup', function(request,response) {
  userApi.signup(request.body.email, request.body.password)
    .then((r) => {
      // user is automatically logged in
      // show account then
      response.redirect('/login');
    })
    .catch((e) => {
      e = JSON.parse(e);
      response.render( 'register', {layout: 'pseudomodal', title: "Sign up - kb:preprints", error: e.message, email: request.body.email } );
    });
  //response.render( 'register', {layout: 'pseudomodal', "title": "Sign up - kb:preprints"} );
});
app.get('/login', function(request,response) {
  if (request.isAuthenticated()) response.redirect('/account');
  else response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints"} );
});
app.post('/login', function(request,response,next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", error: JSON.parse(err).message, email:request.body.email } );
      return 0;
    }
    request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    request.login(user, function(err) {
      if (err) {
        console.log(err);
        response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", error: 'Sorry, we\'ve encountered an error.', email:request.body.email } );
      } else {
        response.redirect('/account');
      }
    });
  })(request, response, next);
});
app.get('/account', function(request,response) {
  if (request.isAuthenticated()) response.render( 'account', {"title": "Account - kb:preprints", layout: "accountlayout"} );
  else response.redirect('/login');
});
app.get('/account/modify-notification', function(request,response) {
  if (request.isAuthenticated()) response.render( 'account-modifynotification', {"title": "Modify notification - kb:preprints", layout: "accountlayout"} );
  else response.redirect('/login');
});
app.get('/account/add-notification', function(request,response) {
  if (request.isAuthenticated()) response.render( 'account-addnotification', {"title": "Add notification - kb:preprints", layout: "accountlayout"} );
  else response.redirect('/login');
});
app.get('/account/settings', function(request,response) {
  if (request.isAuthenticated()) response.render( 'account-settings', {"title": "Settings - kb:preprints", layout: "accountlayout"} );
  else response.redirect('/login');
});
app.get('/account/contact', function(request,response) {
  if (request.isAuthenticated()) response.render( 'account-contact', {"title": "Contact - kb:preprints", layout: "accountlayout"} );
  else response.redirect('/login');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/preprints/last-week', function(request,response) {
  response.render( 'preprint-weekfeed', {"title": "Last week in science - kb:preprints"} );
});

app.get('/preprints/search', function (req, res) {
  
  let hrstart = process.hrtime();

  if( req.query.q !== undefined ) {
    if( req.query.q.includes('science') || req.query.q.includes('discoveries') || req.query.q.includes('inventions')
        || req.query.q.includes('scientific') ) {
      res.render('preprint-weekfeed', {"message":[{"text":"We are showing you the summary of preprints in the last week, because your query suggests general request."}],"title": "Last week in science - kb:preprints","searchquery":query});
      let query = 'redirected: ' + req.query.q.replace(/\+/g," ");
      queryApi.doYourJob( query, req.query.offset || 0, req.query.stats || 1, req.query.sort || 0 )
        .then(() => console.log('redirected to general'))
        .catch((e) => console.log(e));
    } else {
      let query = req.query.q.replace(/\+/g," ");
      queryApi.doYourJob( query, req.query.offset || 0, req.query.stats || 1, req.query.sort || 0 )
      .then( results => {

        //let hrend = process.hrtime(hrstart);
        //(hrend[1] / 1000000 + hrend[0] * 1000).toFixed(0)
        let mainMessage = '';
        if ((req.query.sort || 0) == 0) {
          mainMessage = "Found "+results.numberofall+" results, showing the newest relevant preprints.";
          mainMessage += " <a href='https://knowledgebrowser.org/preprints/search?q="+req.query.q+"&sort=1' class='sortingChanger'>Sort by relevancy only.</a>";
        } else if (req.query.sort == 1) {
          mainMessage = "Found "+results.numberofall+" results, sorted by relevancy.";
          mainMessage += " <a href='https://knowledgebrowser.org/preprints/search?q="+req.query.q+"' class='sortingChanger'>Show newest relevant.</a>";
        }

        res.render('preprint-search',
          { "message": [ { "text": mainMessage } ],
            "publication": results.pubs,
            "title": query+" - kb:preprints",
            "searchquery": query,
            "pagination_prev_activity": results.pagination.prev_activity,
            "pagination_prev_link": results.pagination.prev_link,
            "pagination_next_activity": results.pagination.next_activity,
            "pagination_next_link": results.pagination.next_link,
            "pagination": results.pagination.pages,
            "irrelevant_card1": results.irrelevantCard1,
            "irrelevant_card2": results.irrelevantCard2,
            "offset": req.query.offset || 0,
            "sort": req.query.sort || 0 } );
          
      })
      .catch( e=> {
        res.render('preprint-search',
          { "message": [ { "text": e } ],
          "title": query+" - kb:preprints",
          "searchquery": query } );
      });
    }
  } else {
    res.render( 'preprint-search', { "title": "Knowledge Browser: Preprints", "message": [ { "text": "Please enter your query." }] } );
  }

});

app.get('/preprints/terms-and-privacy', function(req,res) {
  res.render( 'preprint-sub-privacypolicy', { "title": "Privacy policy & Terms of use - kb:preprints" } );
});
app.get('/preprints/about', function(req,res) {
  res.render( 'preprint-sub-about', { "title": "About - kb:preprints" } );
});

app.get('/generate/stats', function(req,res) {
  stats.doYourJob().then( results => {
    res.send( results );
  })
  .catch( e=> {
    res.send( e.toString() );
  })
});

app.get('/generate/weekfeed', function(req,res) {
  feedGenerator.doYourJob('week').then( results => {
    res.send( results );
  })
  .catch( e=> {
    res.send( e.toString() );
  })
});

app.get('/preprints/sitemap.xml', function(req,res) {
  res.send( seoSitemap.xmlFile() );
});

app.get('/stats-internal-blackseo', function(req,res) {
  stats2.doYourJob().then( results => {
    res.render( 'preprint-search', { "title": "Internal", "message": results } );
  })
  .catch( e=> {
    res.send( e.toString() );
  });
});

app.get('*', function(req, res){
  res.render( 'preprint-sub-error', { "title": "Page not found - kb:preprints" } );
});

var port = process.env.PORT || 80;

app.listen(port, function () {
  let today = new Date();
  console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+' server listening on: '+port);
  stats.doYourJob(); //to update default dummy stats file
  feedGenerator.doYourJob('week'); //to update default dummy feed file
});