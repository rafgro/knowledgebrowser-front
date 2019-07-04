'use strict';

const express = require('express'),
      exphbs  = require('express-handlebars'),
      queryApi = require('./queryApi'),
      stats = require('./stats'),
      stats2 = require('./stats2'),
      seoSitemap = require('./seoSitemap'),
      feedGenerator = require('./feedGenerator');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use(express.static(__dirname));

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


app.get('/preprints/last-week', function(request,response) {
  response.render( 'preprint-weekfeed', {"title": "Last week in science - kb:preprints"} );
});

app.get('/preprints/search', function (req, res) {
  
  let hrstart = process.hrtime();

  if( req.query.q !== undefined ) {
    if( req.query.q.includes('science') || req.query.q.includes('discoveries') || req.query.q.includes('inventions')
        || req.query.q.includes('scientific') ) {
      res.render('preprint-weekfeed', {"message":[{"text":"We are showing you the summary of preprints in the last week, because your query suggests general request."}],"title": "Last week in science - kb:preprints"});
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
});