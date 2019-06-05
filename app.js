'use strict';

const express = require('express'),
      exphbs  = require('express-handlebars'),
      queryApi = require('./queryApi');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use(express.static(__dirname));

app.get('/search', function (req, res) {
  
  let hrstart = process.hrtime();

  if( req.query.q.length > 0 ) {
    queryApi.doYourJob( req.query.q.replace("+"," ") )
    .then( results => {

      let hrend = process.hrtime(hrstart);
      res.render('preprint-search',
        { "message": [ { "text": "Execution time: "+(hrend[1] / 1000000 + hrend[0] * 1000).toFixed(2)+" ms" } ],
          "publication": results } );
        
    })
    .catch( e=> {
      res.render('preprint-search',
        { "message": [ { "text": e } ] } );
    });
  } else {
    res.render('preprint-search',
        { "message": [ { "text": "Hi" } ] } );
  }

});

var port = process.env.PORT || 80;

app.listen(port, function () {
  let today = new Date();
  console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+' server listening on: '+port);
});