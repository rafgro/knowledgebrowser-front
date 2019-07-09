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
      session = require('express-session'),
      useragent = require('device');

const app = express();

app.engine('handlebars', exphbs({
  helpers: {
    if_eq: function(a, b, opts) { if(a == b) { return opts.fn(this); } else { return opts.inverse(this); } }
  }
}));
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
  let forWhat = '';
  if (request.query.for != undefined) forWhat = '?for=' + request.query.for;
  if (request.isAuthenticated()) {
    response.redirect('/account' + forWhat);
    return;
  }
  else {
    response.render( 'register', {layout: 'pseudomodal', title: "Sign up - kb:preprints", forWhat: request.query.for } );
    return;
  }
});
app.post('/signup', function(request,response) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = '?for=' + request.query.for;

  if (request.body.password != request.body.password2) {
    response.render( 'register', {layout: 'pseudomodal', title: "Sign up - kb:preprints", error: "Provided passwords are different.", email: request.body.email, forWhat: request.query.for } );
    return;
  }
  userApi.signup(request.body.email, request.body.password, request.query.for)
    .then((r) => {
      // console.log(r);
      request.login([{email:request.body.email}], function(err) {
        if (err) {
          console.log(err);
          response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", error: 'Sorry, we\'ve encountered an error.', email:request.body.email, forWhat: request.query.for} );
          return;
        } else {
          response.redirect('/account' + forWhat);
          return;
        }
      })(request,response,next);
    })
    .catch((e) => {
      if (typeof e != 'object') e = JSON.parse(e);
      response.render( 'register', {layout: 'pseudomodal', title: "Sign up - kb:preprints", error: e.message, email: request.body.email, forWhat: request.query.for } );
      return;
    });
});
app.get('/login', function(request,response) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = '?for=' + request.query.for;
  if (request.isAuthenticated()) {
    response.redirect('/account' + forWhat);
    return;
  }
  else {
    response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", forWhat: request.query.for} );
    return;
  }
});
app.post('/login', function(request,response,next) {
  let forWhat = '';
  if (request.query.for != undefined) forWhat = '?for=' + request.query.for;
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", error: err.message, email:request.body.email, forWhat: request.query.for } );
      return;
    }
    request.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    request.login(user, function(err) {
      if (err) {
        console.log(err);
        response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", error: 'Sorry, we\'ve encountered an error.', email:request.body.email, forWhat: request.query.for } );
        return;
      } else {
        response.redirect('/account' + forWhat);
        return;
      }
    });
  })(request, response, next);
});
app.get('/account', function(request,response) {
  if (request.query.for != undefined) {
    response.redirect('/account/add-notification?for=' + request.query.for);
    return;
  }
  if (request.isAuthenticated()) {
    let messages = [];
    if (request.query.m != undefined) {
      switch(request.query.m) {
        case 'sm':
          messages.push({ color:'success', content: 'Notification successfully modified.' });
          break;
        case 'sc':
          messages.push({ color:'success', content: 'Notification successfully created.' });
          break;
        case 'sd':
          messages.push({ color:'success', content: 'Notification successfully deleted.' });
          break;
      }
    }
    const fewQueries = [ userApi.getAllNotifications(request.user[0].email), userApi.getMailStatus(request.user[0].email)];
    Promise.all(fewQueries)
      .then((res) => {
        // console.log(res);
        if (res[1] != '1') {
          messages.push({ color:'warning', content: 'You need to confirm your mail before we can send you notifications.' });
        }
        if (res[0].length < 20) {
          response.render( 'account', {"title": "Account - kb:preprints", layout: "accountlayout", username:request.user[0].email,error:"You have no notifications.", messages} );
          return;
        } else {
          let parsed = JSON.parse(res[0]);
          parsed = parsed.map((value) => {
            value.queryText = value.query.toUpperCase();
            switch(value.frequency) {
              case 1: value.frequencyText = 'as soon as possible'; break;
              case 2: value.frequencyText = 'max once a day'; break;
              case 3: value.frequencyText = 'max once a few days'; break;
              case 4: value.frequencyText = 'max once a week'; break;
              case 5: value.frequencyText = 'max once a few weeks'; break;
            }
            value.createdText = value.created.replace('T',' ').substring(0,16) + ' UTC';
            return value;
          });
          response.render( 'account', {"title": "Account - kb:preprints", layout: "accountlayout", username:request.user[0].email, notifications: parsed, messages} );
          return;
        }
      })
      .catch((e) => {
        console.log(e);
        response.render( 'account', {"title": "Account - kb:preprints", layout: "accountlayout", username:request.user[0].email, error:e.message, messages} );
        return;
      });
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.post('/account/modify-notification', function(request,response) {
  if (request.isAuthenticated()) {
    if (request.body.purpose === '0') {
      response.render( 'account-modifynotification', {"title": "Modify notification - kb:preprints", layout: "accountlayout", username:request.user[0].email, created:request.body.created, query:request.body.query, minrelevance:request.body.minrelevance, frequency:request.body.frequency, where:request.body.where, hiddenid:request.body.hiddenid, createdText:request.body.createdText } );
      return;
    } else if (request.body.purpose === '1') {
      // console.log(request.body);
      userApi.updateNotification(request.user[0].email, request.body.query, request.body.minrelevance, request.body.frequency, request.body.where, request.body.created, request.body.hiddenid)
        .then(() => {
          response.redirect('/account?m=sm');
          return;
        })
        .catch((e) => {
          response.render( 'account-modifynotification', {"title": "Modify notification - kb:preprints", layout: "accountlayout", username:request.user[0].email, created:request.body.created, query:request.body.query, minrelevance:request.body.minrelevance, frequency:request.body.frequency, where:request.body.where, hiddenid:request.body.hiddenid, error: 'Sorry, we\'ve encountered an error.' } );
          return;
        });
    }
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.post('/account/delete-notification', function(request,response) {
  if (request.isAuthenticated()) {
    if (request.body.purpose === '0') {
      response.render( 'account-deletenotification', {"title": "Delete notification - kb:preprints", layout: "accountlayout", username:request.user[0].email, query:request.body.query, hiddenid:request.body.hiddenid } );
      return;
    } else if (request.body.purpose === '1') {
      userApi.deleteNotification(request.user[0].email, request.body.hiddenid)
        .then(() => {
          response.redirect('/account?m=sd');
          return;
        })
        .catch((e) => {
          response.render( 'account-deletenotification', {"title": "Modify notification - kb:preprints", layout: "accountlayout", username:request.user[0].email, query:request.body.query, hiddenid:request.body.hiddenid, error: 'Sorry, we\'ve encountered an error.' } );
          return;
        });
    }
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.get('/account/add-notification', function(request,response) {
  if (request.isAuthenticated()) {
    response.render( 'account-addnotification', {"title": "Add notification - kb:preprints", layout: "accountlayout", username:request.user[0].email, forWhat:request.query.for} );
    return;
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.post('/account/add-notification', function(request,response) {
  if (request.isAuthenticated()) {
    const parsed = request.body;
    // console.log(request.user[0].email);
    userApi.addOneNotification(request.user[0].email, parsed.keyword, parsed.relevance, parsed.frequency, request.user[0].email)
      .then(() => {
        response.redirect('/account?m=sc');
        return;
      })
      .catch((e) => {
        response.render( 'account-addnotification', {"title": "Add notification - kb:preprints", layout: "accountlayout", username:request.user[0].email, forWhat:request.query.for, error:'Sorry, we\'ve encountered an error.'} );
        return;
      });
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.get('/account/settings', function(request,response) {
  if (request.isAuthenticated()) {
    response.render( 'account-settings', {"title": "Settings - kb:preprints", layout: "accountlayout", username:request.user[0].email} );
    return;
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.post('/account/settings', function(request,response) {
  if (request.isAuthenticated()) {
    if (request.body.purpose == 'mail') {
      if (request.user[0].email == request.body.newmail) {
        response.render( 'account-settings', {"title": "Settings - kb:preprints", layout: "accountlayout", username:request.user[0].email, messages:[{color:'warning',content:'Old and new mail seem the same.'}]} );
        return;
      }
      userApi.changeMail(request.user[0].email, request.body.pass, request.body.newmail)
        .then(() => {
          request.logout();
          response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", forWhat: request.query.for, error: '<span style="color:black !important">Mail changed, please log in using new credentials.</span>'} );
          return;
        })
        .catch((e) => {
          console.log(e);
          response.render( 'account-settings', {"title": "Settings - kb:preprints", layout: "accountlayout", username:request.user[0].email, messages:[{color:'warning',content:'Sorry, we\'ve encountered an error.'}]} );
          return;
        });
    } else if (request.body.purpose == 'pass') {
      if (request.body.newpass != request.body.newpass2) {
        response.render( 'account-settings', {"title": "Settings - kb:preprints", layout: "accountlayout", username:request.user[0].email, messages:[{color:'warning',content:'Provided new passwords are different.'}]} );
        return;
      }
      userApi.changePass(request.user[0].email, request.body.oldpass, request.body.newpass)
        .then(() => {
          request.logout();
          response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", forWhat: request.query.for, error: '<span style="color:black !important">Password changed, please log in using new credentials.</span>'} );
          return;
        })
        .catch((e) => {
          console.log(e);
          response.render( 'account-settings', {"title": "Settings - kb:preprints", layout: "accountlayout", username:request.user[0].email, messages:[{color:'warning',content:'Sorry, we\'ve encountered an error.'}]} );
          return;
        });
    }
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.get('/account/contact', function(request,response) {
  if (request.isAuthenticated()) {
    response.render( 'account-contact', {"title": "Contact - kb:preprints", layout: "accountlayout", username:request.user[0].email} );
    return;
  }
  else {
    response.redirect('/login');
    return;
  }
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
  return;
});


app.get('/account/confirm', function(request,response) {
  userApi.confirmUser(request.query.mail)
    .then(() => {
      response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", forWhat: request.query.for, error: '<span style="color:#03a903 !important">Thank you, mail confirmed!</span>'} );
      return;
    })
    .catch((e) => {
      response.render( 'login', {layout: 'pseudomodal', "title": "Login - kb:preprints", forWhat: request.query.for, error: 'Sorry, we cannot confirm your mail.'} );
      return;
    });
});

app.get('/preprints/last-week', function(request,response) {
  response.render( 'preprint-weekfeed', {"title": "Last week in science - kb:preprints"} );
  return;
});

app.get('/preprints/search', function (req, res) {
  
  let hrstart = process.hrtime();

  if( req.query.q !== undefined ) {
    if( req.query.q.includes('science') || req.query.q.includes('discoveries') || req.query.q.includes('inventions')
        || req.query.q.includes('scientific') ) {
      res.render('preprint-weekfeed', {"message":[{"text":"We are showing you the summary of preprints in the last week, because your query suggests general request."}],"title": "Last week in science - kb:preprints","searchquery":query});
      let query = 'redirected: ' + req.query.q.replace(/\+/g," ");
      queryApi.doYourJob( query, req.query.offset || 0, req.query.stats || 1, req.query.sort || 0 )
        .then(() => {
          console.log('redirected to general');
          return;
        })
        .catch((e) => {
          console.log(e);
          return;
        });
    } else {
      let stats = req.query.stats || 1;
      if (useragent(req.headers['user-agent']).is('bot')) stats = 0;

      let query = req.query.q.replace(/\+/g," ");
      queryApi.doYourJob( query, req.query.offset || 0, stats, req.query.sort || 0 )
      .then( results => {

        //let hrend = process.hrtime(hrstart);
        //(hrend[1] / 1000000 + hrend[0] * 1000).toFixed(0)
        let mainMessage = '';
        if ((req.query.sort || 0) == 0) {
          mainMessage += "Found "+results.numberofall+" results, showing the newest relevant preprints.";
          mainMessage += " <a href='https://knowledgebrowser.org/preprints/search?q="+req.query.q+"&sort=1'>Sort by relevancy only.</a>";
        } else if (req.query.sort == 1) {
          mainMessage += "Found "+results.numberofall+" results, sorted by relevancy.";
          mainMessage += " <a href='https://knowledgebrowser.org/preprints/search?q="+req.query.q+"'>Show newest relevant.</a>";
        }
        mainMessage += '<a href="http://localhost/signup?for='+req.query.q+'" class="sortingChanger blue-button2" rel="nofollow">Update me on new preprints</a>';

        const bottomNotify = '<a href="http://localhost/signup?for='+req.query.q+'" class="blue-button3" rel="nofollow">Update me on new preprints</a>';

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
            "sort": req.query.sort || 0,
            "bottomNotify": bottomNotify } );
        return;
      })
      .catch( e=> {
        res.render('preprint-search',
          { "message": [ { "text": e } ],
          "title": query+" - kb:preprints",
          "searchquery": query } );
        return;
      });
    }
  } else {
    res.render( 'preprint-search', { "title": "Knowledge Browser: Preprints", "message": [ { "text": "Please enter your query." }] } );
    return;
  }

});

app.get('/preprints/terms-and-privacy', function(req,res) {
  res.render( 'preprint-sub-privacypolicy', { "title": "Privacy policy & Terms of use - kb:preprints" } );
  return;
});
app.get('/preprints/about', function(req,res) {
  res.render( 'preprint-sub-about', { "title": "About - kb:preprints" } );
  return;
});

app.get('/generate/stats', function(req,res) {
  stats.doYourJob().then( results => {
    res.send( results );
    return;
  })
  .catch( e=> {
    res.send( e.toString() );
    return;
  })
});

app.get('/generate/weekfeed', function(req,res) {
  feedGenerator.doYourJob('week').then( results => {
    res.send( results );
    return;
  })
  .catch( e=> {
    res.send( e.toString() );
    return;
  })
});

app.get('/preprints/sitemap.xml', function(req,res) {
  res.send( seoSitemap.xmlFile() );
  return;
});

app.get('/stats-internal-blackseo', function(req,res) {
  stats2.doYourJob().then( results => {
    res.render( 'preprint-search', { "title": "Internal", "message": results } );
    return;
  })
  .catch( e=> {
    res.send( e.toString() );
    return;
  });
});

app.get('*', function(req, res){
  res.render( 'preprint-sub-error', { "title": "Page not found - kb:preprints" } );
  return;
});

var port = process.env.PORT || 80;

app.listen(port, function () {
  let today = new Date();
  console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+' server listening on: '+port);
  // stats.doYourJob(); //to update default dummy stats file
  // feedGenerator.doYourJob('week'); //to update default dummy feed file
});