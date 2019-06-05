
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
                let results = JSON.parse(body).results;
                
                if( results != null ) {
                    if( results.hasOwnProperty('message') ) { reject("No results."); }
                    else {
                        results.forEach( element => {
                            let thatDate = (new Date(element.date)).getTime();
                            let days = (today - thatDate) / 86400000;
                            toResolve.push( { "title": element.title, "abstract": element.abstract, "date": days.toFixed(0)+" days ago" } );
                        } );
                        resolve( toResolve );
                    }
                }
                else {
                    reject( "Sorry, we've encountered an error." );
                }
            }

        } );

    });

};