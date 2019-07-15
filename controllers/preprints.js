/* eslint-disable no-unused-vars */
const { Router } = require('express');
const generalExpress = require('express');
const useragent = require('device');

const queryApi = require('../queryApi');

const server = Router();

// Homepage of preprints with search engine

server.get('/', (request, response) => {
  response.render('preprint-homepage', { layout: 'homepage' });
  return;
});

// General science feed of the last week

server.get('/last-week', (request, response) => {
  response.render('preprint-weekfeed', { title: 'Last week in science - kb:preprints' });
  return;
});

// Search engine

server.get('/search', (req, res) => {
  // user is looking for something
  if (req.query.q !== undefined) {
    // checking for general queries
    const lowQuery = req.query.q.toLowerCase();
    if (lowQuery.includes('science') || lowQuery.includes('discoveries') || lowQuery.includes('inventions')
        || lowQuery.includes('scientific')) {
      const query = req.query.q.replace(/\+/g, ' ');
      res.render('preprint-weekfeed', { message: [{ text: 'We are showing you the summary of preprints in the last week, because your query suggests general request.' }], title: 'Last week in science - kb:preprints', searchquery: query });
      return;
    } else {
      // normal query
      let stats = req.query.stats || 1;
      if (useragent(req.headers['user-agent']).is('bot')) stats = 0;
      const query = req.query.q.replace(/\+/g, ' ');

      // calling api on different server
      queryApi.doYourJob(query, req.query.offset || 0, stats, req.query.sort || 0)
        .then((results) => {
          // bunch of generated messages
          let mainMessage = '';
          if ((req.query.sort || 0) == 0) {
            mainMessage += `Found ${results.numberofall} results, showing the newest relevant preprints.`;
            mainMessage += ` <a href='https://knowledgebrowser.org/preprints/search?q=${req.query.q}&sort=1'>Sort by relevancy only.</a>`;
          } else if (req.query.sort == 1) {
            mainMessage += `Found ${results.numberofall} results, sorted by relevancy.`;
            mainMessage += ` <a href='https://knowledgebrowser.org/preprints/search?q=${req.query.q}'>Show newest relevant.</a>`;
          }
          mainMessage += `<a href="https://knowledgebrowser.org/signup?for=${req.query.q}" class="sortingChanger blue-button2" rel="nofollow">Update me on new preprints</a>`;
          const bottomNotify = `<a href="https://knowledgebrowser.org/signup?for=${req.query.q}" class="blue-button3" rel="nofollow">Update me on new preprints</a>`;

          // seo fix: noindex duplicates with spaces instead of pluses
          let anynoindex = null;
          if (req.query.q.includes(' ')) anynoindex = 1;

          // response
          res.render('preprint-search',
            {
              message: [{ text: mainMessage }],
              publication: results.pubs,
              title: `${query} - kb:preprints`,
              searchquery: query,
              pagination_prev_activity: results.pagination.prev_activity,
              pagination_prev_link: results.pagination.prev_link,
              pagination_next_activity: results.pagination.next_activity,
              pagination_next_link: results.pagination.next_link,
              pagination: results.pagination.pages,
              irrelevant_card1: results.irrelevantCard1,
              irrelevant_card2: results.irrelevantCard2,
              offset: req.query.offset || 0,
              sort: req.query.sort || 0,
              bottomNotify,
              anynoindex,
            });
          return;
        })
        .catch((e) => {
          res.render('preprint-search',
            {
              message: [{ text: e }],
              title: `${query} - kb:preprints`,
              searchquery: query,
            });
          return;
        });
    }
  } else {
    res.render('preprint-search', { title: 'Knowledge Browser: Preprints', message: [{ text: 'Please enter your query.' }] });
    return;
  }
});

// Subpages

server.get('/terms-and-privacy', (req, res) => {
  res.render('preprint-sub-privacypolicy', { title: 'Privacy policy & Terms of use - kb:preprints' });
  return;
});

server.get('/about', (req, res) => {
  res.render('preprint-sub-about', { title: 'About - kb:preprints' });
  return;
});

exports.routes = server;
