
const request = require('request');

exports.doYourJob = function( query ) {

    return new Promise( ( resolve, reject ) => {

        request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/search?q='+query,
          {timeout: 20000}, (error, response, body) => {

            if( error ) {
                reject( error );
            }
            else {
                let toResolve = [];
                let today = Date.now();
                JSON.parse(body).results.forEach( element => {
                    let thatDate = (new Date(element.date)).getTime();
                    let days = (today - thatDate) / 86400000;
                    toResolve.push( { "title": unescape(element.title), "abstract": unescape(element.abstract), "date": days.toFixed(0)+" days ago" } );
                } );
                resolve( toResolve );
            }

        } );

    });

};