
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
                JSON.parse(body).results.forEach( element => {
                    toResolve.push( { "title": unescape(element.title), "abstract": unescape(element.abstract), "date": element.date } );
                } );
                resolve( toResolve );
            }

        } );

    });

};