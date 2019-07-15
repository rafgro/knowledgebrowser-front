/* eslint-disable no-unused-vars */
const { Router } = require('express');
const generalExpress = require('express');

const server = Router();

// 301 redirect
// eslint-disable-next-line arrow-body-style
server.get('/', (request, response) => {
  return response.redirect(301, 'https://knowledgebrowser.org/preprints');
});

// Http errors
/* server.use((request, response) => {
  response.status(404);
  response.render( 'preprint-sub-error', { "title": "Page not found - kb:preprints" } );
  return;
}); */

exports.routesServer = server;
