'use strict';

const express = require('express'),
      exphbs  = require('express-handlebars'),
      queryApi = require('./queryApi'),
      stats = require('./stats');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use(express.static(__dirname));

const {shiphold} = require('ship-hold');
const sh = shiphold({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : 'postgres'
});
/*const sh = shiphold({
    host     : '127.0.0.1',
    user     : 'crawler',
    password : 'blackseo666',
    database : 'preprint-crawls'
});*/

app.get('/search', function (req, res) {
  
  let hrstart = process.hrtime();

  if( req.query.q !== undefined ) {
    let query = req.query.q.replace(/\+/g," ");
    queryApi.doYourJob( query, req.query.offset || 0 )
    .then( results => {

      let hrend = process.hrtime(hrstart);
      res.render('preprint-search',
        { "message": [ { "text": "Execution time: "+(hrend[1] / 1000000 + hrend[0] * 1000).toFixed(2)
                                 +" ms. Found "+results.numberofall+" results." } ],
          "publication": results.pubs,
          "title": query+" - Knowledge Browser",
          "searchquery": query,
          "pagination_prev_activity": results.pagination.prev_activity,
          "pagination_prev_link": results.pagination.prev_link,
          "pagination_next_activity": results.pagination.next_activity,
          "pagination_next_link": results.pagination.next_link,
          "pagination": results.pagination.pages,
          "irrelevant_card1": results.irrelevantCard1,
          "irrelevant_card2": results.irrelevantCard2 } );
        
    })
    .catch( e=> {
      res.render('preprint-search',
        { "message": [ { "text": e } ],
        "title": query+" - Knowledge Browser",
        "searchquery": query } );
    });
  } else {
    res.render( 'preprint-search', { "title": "Knowledge Browser", "message": [ { "text": "Hi!" }] } );
  }

});

app.get('/stats', function(req,res) {
  stats.doYourJob().then( results => {
    res.render( 'preprint-search', { "title": "Knowledge Browser", "message": results.messages } );
  })
  .catch( e=> {
    res.render( 'preprint-search', { "title": "Knowledge Browser", "message": [ { "text": e } ] } );
  })
});

var port = process.env.PORT || 80;

app.listen(port, function () {
  let today = new Date();
  console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+' server listening on: '+port);
});