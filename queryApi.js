
const request = require('request');

exports.doYourJob = function( query, offset=0 ) {

    return new Promise( ( resolve, reject ) => {

        request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/search?q='+query+'&offset='+offset+'&freshmode=1',
          {timeout: 20000}, (error, response, body) => {

            if( error ) {
                reject( error );
            }
            else {
                let toResolve = [];
                let today = Date.now();
                let results = JSON.parse(body).results;
                let allresults = JSON.parse(body).numberofall;
                
                if( results != null ) {
                    if( results.hasOwnProperty('message') ) { reject("No results."); }
                    else {

                        results.forEach( element => {
                            let thatDate = (new Date(element.date)).getTime();
                            let days = (today - thatDate) / 86400000;
                            let datemy = days.toFixed(0)+" days ago";
                            let hours = ((today - thatDate) / 3600000);
                            if( days <= 1 ) datemy = hours.toFixed(0)+" hours ago";
                            if( hours <= 1 ) datemy = "less than hour ago";
                            if( days <= 7 ) datemy = '<strong>'+datemy+'</strong>';
                            toResolve.push( { "title": element.title, "abstract": element.abstract,
                              "date": datemy, "relevancy": element.relativeWeight+"/10 relevant" } );
                        } );

                        let paginationObj = {
                            prev_link: '#',
                            prev_activity: '',
                            next_link: '#',
                            next_activity: '',
                            pages: new Array()
                        };
                        let intOffset = parseInt(offset);
                        let origQuery = query.replace(/ /g,'+');
                        if( intOffset == 0 ) { paginationObj.prev_link = '#'; paginationObj.prev_activity = 'disabled'; }
                        else { paginationObj.prev_link = 'http://knowbrofront-env.cnpkrtkwe6.us-east-2.elasticbeanstalk.com/search?q='+origQuery+'&offset='+(intOffset-10); }
                        if( intOffset+10 >= allresults ) { paginationObj.next_link = '#'; paginationObj.next_activity = 'disabled'; }
                        else { paginationObj.next_link = 'http://knowbrofront-env.cnpkrtkwe6.us-east-2.elasticbeanstalk.com/search?q='+origQuery+'&offset='+(intOffset+10); }
                        let maxButtons = 0;
                        let maxButtonsLimit = 9;
                        let starter = 1;
                        if( intOffset > 85 && allresults > 90 ) { starter = 9; maxButtonsLimit = 11; }
                        if( intOffset > 185 && allresults > 190 ) { starter = 19; maxButtonsLimit = 11; }
                        if( intOffset > 285 && allresults > 290 ) { starter = 29; maxButtonsLimit = 11; }
                        if( intOffset > 385 && allresults > 390 ) { starter = 39; maxButtonsLimit = 11; }
                        for( let i = starter; i < ((allresults/10)+1); i++ ) {
                            let whatActivity = '';
                            if( (intOffset+10)/10 == i ) whatActivity = 'active';
                            let whatLink = '';
                            if( i == 1 && whatActivity != 'active' ) whatLink = 'http://knowbrofront-env.cnpkrtkwe6.us-east-2.elasticbeanstalk.com/search?q='+origQuery;
                            else if( whatActivity != 'active' ) whatLink = 'http://knowbrofront-env.cnpkrtkwe6.us-east-2.elasticbeanstalk.com/search?q='+origQuery+'&offset='+10*(i-1);

                            paginationObj.pages.push( { activity: whatActivity, number: i, link: whatLink } );

                            maxButtons++;
                            if( maxButtons > maxButtonsLimit ) break;
                        }

                        resolve( { pubs: toResolve, numberofall: allresults, pagination: paginationObj } );
                    }
                }
                else {
                    reject( "Sorry, we've encountered an error." );
                }
            }

        } );

    });

};