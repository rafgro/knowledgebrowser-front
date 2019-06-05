'use strict';

const express = require('express'),
      exphbs  = require('express-handlebars'),
      queryApi = require('./queryApi');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  
  let hrstart = process.hrtime();

  queryApi.doYourJob( 'gravity' )
  .then( results => {

    let hrend = process.hrtime(hrstart);
    res.render('preprint-search',
      { "message": [ { "text": "Execution time: "+(hrend[1] / 1000000 + hrend[0] * 1000).toFixed(2)+" ms" } ],
        "publication": results } );
      
  })
  .catch( e=> {
    res.render('preprint-search',
      { "message": [ { "text": "Error: "+JSON.stringify(e) } ] } );
  });

});

app.listen(80, function () {
    console.log('server listening on: 80');
});