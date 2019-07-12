
//const request = require('request');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require("request"), {multiArgs: true});
var fs = require("fs");

exports.doYourJob = function(whichJob) {
  const dateNow = Date.now();
  const date = new Date(Date.now());
  const today = date.getUTCFullYear()
    + (date.getUTCMonth() + 1 < 10 ? '-0' : '-')
    + (date.getUTCMonth() + 1)
    + (date.getUTCDate() < 10 ? '-0' : '-')
    + date.getUTCDate();

  return new Promise( ( resolve, reject ) => {
    if (whichJob === 'week') {
      // outline:
      // 1. take queries from api type a
      // 2. ask for each query, get and render results

      // 1.
      request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/terms?today='+today+'&type=a',
        (error, response, body) => {
        if (error) reject(error);
        if (body == undefined) reject('Empty body');
        if (body.length < 25) reject('Empty body');
        let queries = [];
        try {
          queries = JSON.parse(body);
        } catch(e) {
          reject(e);
        }
        if (queries.length < 5) reject('Empty body');
        
        // 2.
        const toAsk = queries.map(val => val.t);
        Promise.map(toAsk, function (query) {
          return request.getAsync('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/search?q='+query+'&stats=0').spread(function(response,body) { return [body, query]; });
        }).then(whatWeHave => {
            
          let toWrite = '{{#each message}}<div class="row" style="padding-bottom:2rem"><div class="col-md-12 equel-grid"><small style="width:100%">{{{text}}}</small></div></div>{{/each}}';
          toWrite += '<h2 style="padding-bottom:2rem">Last week in science - most popular topics and corresponding preprints</h2>';
          let iterator = 0;
          whatWeHave.forEach((one) => {
            let up = '';
            if (iterator > 0) up = '; padding-top:2.5rem';
            toWrite += '<h3 style="padding-bottom:0.25rem'+up+'"><a href="https://knowledgebrowser.org/preprints/search?q='+one[1].replace(/ /g,'+')+'">' + one[1].substring(0,1).toUpperCase() + one[1].substring(1) + '</a></h3><small style="padding-bottom:0.5rem">' + queries[iterator].n + ' preprints</small>'; //head
            let itsResults = null;
            try {
              itsResults = JSON.parse(one[0]).results;
            } catch(e) {
              reject(e);
            }

            let thatDate = (new Date(itsResults[0].date)).getTime();
            let days = (dateNow - thatDate) / 86400000;
            let timeAgo = days.toFixed(0)+" days ago";
            let hours = ((dateNow - thatDate) / 3600000);
            if( days <= 1.25 ) timeAgo = hours.toFixed(0)+" hours ago";
            else if( days < 2 ) timeAgo = "1 day ago";
            if( hours <= 1.1 ) timeAgo = "less than hour ago";
            if( days <= 1.25 ) timeAgo = '<span style="color:#000000">'+timeAgo+'</span>';

            for( let i = 0; i < 3; i += 1 ) {
              toWrite += '<div class="row"><div class="col-md-12 equel-grid"><div class="grid"><div class="grid-body search-result"><div class="vertical-timeline-wrapper"><div class="timeline-vertical dashboard-timeline"><div class="row activity-log"><div class="col-12 col-md-9"><a href="'+itsResults[i].link+'"><p class="log-name mathjax">'+itsResults[i].title+'</p></a><div class="log-details mathjax">'+itsResults[i].abstract+'</div></div><div class="col-12 col-md-3"><small class="log-time"><span style="color:#000000">'+timeAgo+'</span><br/>'+itsResults[i].server+'</small></div></div></div></div></div></div></div></div>';
            }

            iterator += 1;
          });

          fs.writeFile("./views/preprint-weekfeed.handlebars", toWrite, (err) => {
            if (err) reject(err);
            resolve("Successfully written week feed to file.");
          });

        }).catch(e => reject(e));
      });
    }
  });

};
