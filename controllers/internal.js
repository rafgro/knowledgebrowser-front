/* eslint-disable no-unused-vars */
const { Router } = require('express');
const generalExpress = require('express');

const stats = require('../stats');
const stats2 = require('../stats2');
const feedGenerator = require('../feedGenerator');
const seoSitemap = require('../seoSitemap');

const server = Router();

// Internal stats monitoring

server.get('/stats-internal-blackseo', (req, res) => {
  stats2.doYourJob()
    .then((results) => {
      res.render('preprint-search', { title: 'Internal', message: results });
      return;
    })
    .catch((e) => {
      res.send(e.toString());
      return;
    });
});

// Generating static files

server.get('/generate/stats', (req, res) => {
  stats.doYourJob()
    .then((results) => {
      res.send(results);
      return;
    })
    .catch((e) => {
      res.send(e.toString());
      return;
    });
});

server.get('/generate/weekfeed', (req, res) => {
  feedGenerator.doYourJob('week')
    .then((results) => {
      res.send(results);
      return;
    })
    .catch((e) => {
      res.send(e.toString());
      return;
    });
});

// SEO responses

server.get('/preprints/sitemap.xml', (req, res) => {
  res.send(seoSitemap.xmlFile());
  return;
});

exports.routes = server;
