
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'), { multiArgs: true });
const fs = require('fs');

const allFeeds = require('./config/feeds');

exports.doYourJob = function (whichJob) {
  const dateNow = Date.now();
  const date = new Date(Date.now());
  const today = date.getUTCFullYear()
    + (date.getUTCMonth() + 1 < 10 ? '-0' : '-')
    + (date.getUTCMonth() + 1)
    + (date.getUTCDate() < 10 ? '-0' : '-')
    + date.getUTCDate();

  return new Promise((resolve, reject) => {
    let type = '';
    let name = '';
    let filename = '';
    if (whichJob === 'week') {
      type = 'a';
      name = 'science';
      filename = 'weekfeed';
    } else {
      allFeeds.listOfFeeds.forEach((v) => {
        if (v.name === whichJob) {
          type = v.shorthand;
          // eslint-disable-next-line prefer-destructuring
          name = v.name;
          filename = `weekfeed-${name}`;
        }
      });
    }

    // outline:
    // 1. take queries from api type a
    // 2. ask for each query, get and render results

    // 1.
    request(`http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/terms?today=${today}&type=${type}`,
      (error, response, body) => {
        if (error) return reject(error);
        if (body == undefined) return reject('Empty body');
        if (body.length < 25) return reject('Empty body');
        // { noofall: res[0].noofall, terms: res[0].processedtermss }
        const queries = JSON.parse(JSON.parse(body).terms);
        // eslint-disable-next-line prefer-destructuring
        const noofall = JSON.parse(body).noofall;
        const bestServer = allFeeds.bestServers[type];
        /* try {
          queries = JSON.parse(body);
        } catch (e) {
          reject(e);
        } */
        if (queries.length < 5) return reject('Empty body');

        // 2.
        const toAsk = queries.map(val => val.t);
        // eslint-disable-next-line arrow-body-style
        Promise.map(toAsk, (query) => {
          return request.getAsync(`http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/search?q=${query}&stats=0&span=168&sort=1`).spread((_response2, body2) => [body2, query]);
        }).then((whatWeHave) => {
          const timestamp = `${today} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
          const statObj = [
            { icon: 'mdi-file-multiple', number: noofall || '~', desc: `new preprints about ${name.replace(/-/g, ' ')} in the last week` },
            { icon: 'mdi-fire', number: bestServer, desc: `most active server in ${name.replace(/-/g, ' ')} in the last week` },
          ];
          let toWrite = `<!-- ${timestamp} --> {{#each message}}<div class="row" style="padding-bottom:2rem"><div class="col-md-12 equel-grid"><small style="width:100%">{{{text}}}</small></div></div>{{/each}}<h2 style="padding-top:0.5rem; padding-bottom:2rem">last week in ${name.replace(/-/g, ' ')}</h2><div class="row"><div class="col-md-12 order-md-0"><div class="row"><div class="col-12 col-md-6 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-primary no-avatar component-flat mx-auto mb-4"><i class="mdi ${statObj[0].icon} mdi-2x"></i></div><h2 class="font-weight-medium">${statObj[0].number}</h2><small class="text-gray d-block mb-3">${statObj[0].desc}</small></div></div></div><div class="col-12 col-md-6 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-primary no-avatar component-flat mx-auto mb-4"><i class="mdi ${statObj[1].icon} mdi-2x"></i></div><h2 class="font-weight-medium">${statObj[1].number}</h2><small class="text-gray d-block mb-3">${statObj[1].desc}</small></div></div></div></div></div></div><div class="row"><div class="col-12 col-md-12 equel-grid"><div class="row flex-grow"><div class="col-12 equel-grid"><div class="grid widget-revenue-card homepage-grid"><div class="grid-body d-flex flex-column h-100 chart-card" style="padding-bottom:10px !important"><h4 style="padding-bottom:2rem">most popular topics mentioned by preprints</h4><div class="row" style="padding-bottom:2rem"><center>`;
          let iterate = 0;
          queries.forEach((el) => {
            iterate += 1;
            toWrite += `<a href="#${el.t.replace(/ /g, '')}" class="blue-button" style="background-color: rgba(0, 95, 255, 0.6); !important">${el.t}<span class="number-in-button">${el.n}`;
            if (iterate == 1) toWrite += ' preprints';
            toWrite += '</span></a>';
          });
          toWrite += '</center></div></div></div></div></div></div></div>';
          let iterator = 0;
          let even = true;
          whatWeHave.forEach((one) => {
            let up = '';
            if (iterator === 0) up = '; padding-top:2.5rem';
            // const nameOfTerm = (one[1].substring(0, 1).toUpperCase() + one[1].substring(1))
            const nameOfTerm = one[1]
              .replace('rna', 'RNA')
              .replace('Rna', 'RNA')
              .replace('dna', 'DNA')
              .replace('ii', 'II');
            if (even) toWrite += `<div class="row" style="padding-bottom:2.5rem${up}">`;
            toWrite += `<a name="${one[1].replace(/ /g, '')}" style="margin-top: -90px"></a><div class="col-12 col-lg-6"><h3 style="padding-bottom:0.25rem"><a href="https://knowledgebrowser.org/preprints/search?q=${one[1].replace(/ /g, '+')}">${nameOfTerm}</a></h3><small style="padding-bottom:1rem">${queries[iterator].n} preprints</small>`; // head
            let itsResults = null;
            try {
              itsResults = JSON.parse(one[0]).results;
            } catch (e) {
              reject(e);
            }

            for (let i = 0; i < 3; i += 1) {
              if (itsResults[i] != undefined) {
                const thatDate = (new Date(itsResults[i].date)).getTime();
                const days = (dateNow - thatDate) / 86400000;
                let timeAgo = `${days.toFixed(0)} days ago`;
                const hours = ((dateNow - thatDate) / 3600000);
                if (days <= 1.25) timeAgo = `${hours.toFixed(0)} hours ago`;
                else if (days < 2) timeAgo = '1 day ago';
                if (hours <= 1.1) timeAgo = 'less than hour ago';
                if (days <= 1.25) timeAgo = `<span style="color:#000000">${timeAgo}</span>`;

                toWrite += `<div class="row"><div class="col-md-12 equel-grid"><div class="grid"><div class="grid-body search-result"><div class="vertical-timeline-wrapper"><div class="timeline-vertical dashboard-timeline"><div class="row activity-log"><div class="col-12 col-md-9"><a href="${itsResults[i].link}"><p class="log-name mathjax">${itsResults[i].title.replace(/\{\{/g, '\\{\\{').replace(/\}\}/g, '\\}\\}')}</p></a><div class="log-details mathjax">${itsResults[i].abstract.replace(/\{\{/g, '\\{\\{').replace(/\}\}/g, '\\}\\}')}</div></div><div class="col-12 col-md-3"><small class="log-time"><span style="color:#000000">${timeAgo}</span><br/>${itsResults[i].server}</small></div></div></div></div></div></div></div></div>`;
              }
            }
            toWrite += '</div>';
            if (!even) toWrite += '</div>';

            iterator += 1;
            even = !even;
          });
          if (!even) toWrite += '</div>';

          fs.writeFile(`./views/preprint-${filename}.handlebars`, toWrite, (err) => {
            if (err) reject(err);
            resolve(`Successfully written feed for ${name}.`);
          });
        }).catch(e => reject(e));
      });
  });
};
