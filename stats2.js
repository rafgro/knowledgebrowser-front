
const request = require('request');
var fs = require("fs");

exports.doYourJob = function() {

    return new Promise( ( resolve, reject ) => {

        request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/stats2',
          {timeout: 20000}, (error, response, body) => {

            if( error ) {
                reject( error );
            }
            else {
                
              let results = JSON.parse(body);
              resolve(results);

            }

        } );

    });

};