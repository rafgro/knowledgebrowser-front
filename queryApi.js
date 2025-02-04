
const request = require('request');

exports.doYourJob = function (query, offset = 0, stats = 1, sort = 0) {
  return new Promise((resolve, reject) => {
    request(`http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/search?q=${query}&offset=${offset}&stats=${stats}&sort=${sort}`,
      { timeout: 20000 }, (error, response, body) => {
        if (error) {
          reject('Sorry, we have encountered an error.');
        } else {
          const toResolve = [];
          const today = Date.now();
          // eslint-disable-next-line prefer-destructuring
          const results = JSON.parse(body).results;
          const allresults = JSON.parse(body).numberofall;

          if (results != null) {
            if (results.hasOwnProperty('message')) { reject('No results.'); } else {
              let doWeHideIrrelevant = false;
              if (results[0].relativeWeight >= 4) doWeHideIrrelevant = true;
              let doWeShowIrrelevantCard = false;

              let numberOf = 0;
              results.forEach((element) => {
                const thatDate = (new Date(element.date)).getTime();
                const days = (today - thatDate) / 86400000;
                let datemy = `${days.toFixed(0)} days ago`;
                const hours = ((today - thatDate) / 3600000);
                if (days <= 1.25) datemy = `${hours.toFixed(0)} hours ago`;
                else if (days < 2) datemy = '1 day ago';
                if (hours <= 1.1) datemy = 'less than hour ago';
                if (days <= 1.25) datemy = `<span style="color:#000000">${datemy}</span>`;
                let inlineStyle = '';
                if (doWeHideIrrelevant && parseInt(element.relativeWeight) < 4) {
                  inlineStyle = 'id="lowRelevancy" style="display:none"';
                  doWeShowIrrelevantCard = true;
                }
                let relevantMy = `${element.relativeWeight}/10 relevant`;
                if (parseInt(element.relativeWeight) >= 8) relevantMy = `<span style="color:#000000">${relevantMy}</span>`;
                numberOf += 1;
                toResolve.push({ 'title': element.title,
'abstract': element.abstract,
                  'date': datemy,
relevancy: relevantMy,
abstractFull: element.abstractFull,
                  inlineStyle: inlineStyle,
server: element.server,
'link': element.link,
number: numberOf });
              });

              let doWeSorryForResults = false;
              if (results[0].relativeWeight < 4 && offset == 0) doWeSorryForResults = true;

              const paginationObj = {
                prev_link: '#',
                prev_activity: '',
                next_link: '#',
                next_activity: '',
                pages: new Array(),
              };
              const intOffset = parseInt(offset);
              let whatSort = '';
              if (sort == 1) whatSort = '&sort=1';
              const origQuery = query.replace(/ /g, '+');
              if (intOffset == 0) { paginationObj.prev_link = '#'; paginationObj.prev_activity = 'disabled'; } else { paginationObj.prev_link = `https://knowledgebrowser.org/preprints/search?q=${origQuery}&offset=${intOffset-10}${whatSort}`; }
              if (intOffset + 10 >= allresults) { paginationObj.next_link = '#'; paginationObj.next_activity = 'disabled'; } else { paginationObj.next_link = `https://knowledgebrowser.org/preprints/search?q=${origQuery}&offset=${intOffset+10}${whatSort}`; }
              let maxButtons = 0;
              let maxButtonsLimit = 9;
              let starter = 1;
              if (intOffset > 85 && allresults > 90) { starter = 9; maxButtonsLimit = 11; }
              if (intOffset > 185 && allresults > 190) { starter = 19; maxButtonsLimit = 11; }
              if (intOffset > 285 && allresults > 290) { starter = 29; maxButtonsLimit = 11; }
              if (intOffset > 385 && allresults > 390) { starter = 39; maxButtonsLimit = 11; }
              for (let i = starter; i < ((allresults / 10) + 1); i++) {
                let whatActivity = '';
                if ((intOffset + 10) / 10 == i) whatActivity = 'active';
                let whatLink = '';
                if (i == 1 && whatActivity != 'active') whatLink = `https://knowledgebrowser.org/preprints/search?q=${origQuery}${whatSort}`;
                else if (whatActivity != 'active') whatLink = `https://knowledgebrowser.org/preprints/search?q=${origQuery}&offset=${10*(i-1)}${whatSort}`;

                paginationObj.pages.push({ activity: whatActivity, number: i, link: whatLink });

                maxButtons++;
                if (maxButtons > maxButtonsLimit) break;
              }

              resolve({ pubs: toResolve,
numberofall: allresults,
pagination: paginationObj,
                irrelevantCard1: doWeShowIrrelevantCard,
irrelevantCard2: doWeSorryForResults });
            }
          } else {
            reject(JSON.parse(body).message);
          }
        }
      });
  });
};
