
const request = require('request');

exports.doYourJob = function() {

    return new Promise( ( resolve, reject ) => {

        request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/stats',
          {timeout: 20000}, (error, response, body) => {

            if( error ) {
                reject( [ { "text": error } ] );
            }
            else {
                
              let results = JSON.parse(body);
                
                if( results != null ) {
                    resolve( results );
                }
                else {
                    reject( [ { "text": "Sorry, we've encountered an error." } ] );
                }
            }

        } );

    });

};