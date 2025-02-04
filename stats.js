
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'), { multiArgs: true });
const fs = require('fs');

exports.doYourJob = function () {
  return new Promise((resolve, reject) => {
    const date = new Date(Date.now());
    const today = date.getUTCFullYear()
+ (date.getUTCMonth() + 1 < 10 ? '-0' : '-')
+ (date.getUTCMonth() + 1)
+ (date.getUTCDate() < 10 ? '-0' : '-')
+ date.getUTCDate();

    const urlList = ['http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/stats',
      `http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/terms?today=${today}&type=a`];
    Promise.map(urlList, (url) => request.getAsync(url).spread((response, body) => [body, url])).then((whatWeHave) => {
      let whichIsStats = 0;
      let whichIsStats2 = 1;
      if (whatWeHave[1][1] == 'http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/stats') {
        whichIsStats = 1;
        whichIsStats2 = 0;
      }
      const results = JSON.parse(whatWeHave[whichIsStats][0]);

      let toWrite = `<div class="row"><div class="col-md-12 order-md-0"><div class="row"><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-primary no-avatar component-flat mx-auto mb-4"><i class="mdi mdi-file-multiple mdi-2x"></i></div><h2 class="font-weight-medium">${results[5].lastWeek}</h2><small class="text-gray d-block mb-3">new preprints in the last week</small>`;
      let howMuch = 0;
      howMuch = ((parseInt(results[5].lastWeek, 10) - parseInt(results[10].previousWeek, 10)) / parseInt(results[10].previousWeek, 10)) * 100;
      if (howMuch >= 0) {
        if (howMuch >= 100) howMuch = '∞';
        else howMuch = howMuch.toFixed(1);
        toWrite += `<small class="font-weight-medium text-success"><i class="mdi mdi-menu-up"></i><span class="animated-count">${howMuch}</span>%</small>`;
      } else {
        if (howMuch <= -100) howMuch = '∞';
        else howMuch = (howMuch * (-1)).toFixed(1);
        toWrite += `<small class="font-weight-medium text-gray"><i class="mdi mdi-menu-down"></i><span class="animated-count">${howMuch}</span>%</small>`;
      }
      toWrite += '</div></div></div><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-primary no-avatar component-flat mx-auto mb-4"><i class="mdi mdi-file mdi-2x"></i></div><h2 class="font-weight-medium">';
      if (parseInt(results[3].today, 10) == 0) toWrite += 'no';
      else toWrite += results[3].today;
      toWrite += '</h2><small class="text-gray d-block mb-3">new preprints today</small>';
      howMuch = 0;
      howMuch = ((parseInt(results[3].today, 10) - parseInt(results[9].yesterday, 10)) / parseInt(results[9].yesterday, 10)) * 100;
      if (howMuch >= 0) {
        if (howMuch >= 100) howMuch = '∞';
        else howMuch = howMuch.toFixed(1);
        toWrite += `<small class="font-weight-medium text-success"><i class="mdi mdi-menu-up"></i><span class="animated-count">${howMuch}</span>%</small>`;
      } else {
        if (howMuch <= -100) howMuch = '∞';
        else howMuch = (howMuch * (-1)).toFixed(1);
        toWrite += `<small class="font-weight-medium text-gray"><i class="mdi mdi-menu-down"></i><span class="animated-count">${howMuch}</span>%</small>`;
      }
      toWrite += '</div></div></div><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-success no-avatar component-flat mx-auto mb-4"><i class="mdi mdi mdi-server-network mdi-2x"></i></div><h2 class="font-weight-medium">28</h2><small class="text-gray d-block mb-3">preprint servers</small><small class="font-weight-medium text-success">newest: medRxiv</small></div></div></div><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-warning no-avatar component-flat mx-auto mb-4"><i class="mdi mdi-fire mdi-2x"></i></div><h2 class="font-weight-medium">arXiv</h2><small class="text-gray d-block mb-3">most active server</small><small class="text-gray">';
      toWrite += (parseInt(results[11].preprintServers[0].lastMonth) / parseInt(results[11].preprintServers[1].lastMonth)).toFixed(1);
      toWrite += 'x more than 2nd</small></div></div></div></div></div></div>';

      // JSON.parse(whatWeHave[whichIsStats2][0]);
      // console.log(JSON.stringify(whatWeHave[whichIsStats2]));
      const results2 = JSON.parse(JSON.parse(whatWeHave[whichIsStats2][0]).terms);
      toWrite += '<div class="row"><div class="col-12 col-md-12 equel-grid"><div class="row flex-grow"><div class="col-12 equel-grid"><div class="grid widget-revenue-card homepage-grid"><div class="grid-body d-flex flex-column h-100 chart-card" style="padding-bottom:10px !important"><div class="split-header" style="padding-bottom:1rem"><p class="card-title">what\'s the newest science about? most popular mentions in the last 7 days</p></div><center>';
      let iterate = 0;
      results2.forEach((el) => {
        iterate += 1;
        toWrite += `<a href="https://knowledgebrowser.org/preprints/search?q=${el.t.replace(/ /g,"+")}" class="blue-button"  onClick="gtag_report_conversion()">${el.t} <span class="number-in-button">${el.n}`;
        if (iterate == 1) toWrite += ' preprints';
        toWrite += '</span></a>';
      });
      toWrite += '</center></div><a class="browse-bottom" href="https://knowledgebrowser.org/preprints/last-week"  onClick="gtag_report_conversion()"><small>browse all</small></a><div class="browse-bottom"><small>browse sciences: <a href="https://knowledgebrowser.org/preprints/last-week/biology">BIOLOGY</a>, <a href="https://knowledgebrowser.org/preprints/last-week/chemistry">CHEMISTRY</a>, <a href="https://knowledgebrowser.org/preprints/last-week/computer-science">COMPUTER SCIENCE</a>, <a href="https://knowledgebrowser.org/preprints/last-week/economics">ECONOMICS</a>, <a href="https://knowledgebrowser.org/preprints/last-week/physics">PHYSICS</a></small></a></div></div></div></div></div>';

      toWrite += '<div class="row"><div class="col-12 col-md-8 equel-grid"><div class="grid homepage-grid"><div class="grid-body py-3"><p class="card-title ml-n1">most popular preprint servers</p></div><div class="table-responsive"><table class="table table-hover table-sm"><thead><tr class="solid-header"><th colspan="2" class="pl-4"> </th><th>last month</th><th>last week <i class="mdi mdi-menu-down"></i></th><th>newest</th></tr></thead><tbody>';
      let limit = 0;
      for (const element of results[11].preprintServers) {
        toWrite += `<tr><td class="pr-0 pl-4"><img class="profile-img img-sm" src="https://www.placehold.it/50x50" alt="profile image"></td><td class="pl-md-0"><small class="text-black font-weight-medium d-block">${element.name}</small></td><td><small>${element.lastMonth}</small></td><td><small>${element.lastWeek}</small></td><td>${element.lastPreprint}</td></tr>`;
        limit++;
        if (limit >= 12) break;
      }
      toWrite += '</tbody></table></div></div></div><div class="col-12 col-md-4 equel-grid"><div class="row flex-grow"><div class="col-12 equel-grid"><div class="grid widget-revenue-card homepage-grid"><div class="grid-body d-flex flex-column h-100 chart-card"><div class="row"><div class="col-12"><div class="split-header"><p class="card-title">latest preprints</p></div>';
      results[8].lastPreprints.forEach((element) => {
        toWrite += `<div class="mt-1"><div class="content-wrapper v-centered"><small class="text-muted">${element.date.toString().substring(0,10)}</small></div><p class="text-gray mathjax"><a href="${element.link}">${unescape(element.title)}</a></p></div>`;
      });
      toWrite += '</div></div></div></div></div></div></div></div>';
      toWrite += '<div class="row"><div class="col-12 equel-grid"><div class="grid"><div class="grid-body chart-card with-text"><div class="d-flex justify-content-between"><p class="card-title"><h1>brief intro on preprints</h1></p></div><div class="vertical-timeline-wrapper"><div class="timeline-vertical dashboard-timeline"><div class="activity-log"><div class="row"><div class="col-12"><div class="longer-text-div">Preprints are <u>not peer-reviewed</u> scientific articles, posted <u>before</u> publication in scientific journal. Currently, the most popular form of preprint circulation relies on public preprint servers, specific for area of science (medRxiv for health sciences, PsyArXiv for psychology, etc.).<br/><br/>Details of preprint submission differ between servers and fields:<br/>- Preprint can be posted after acceptance by journal, but still before publication. In this manner, scientists provide free version of their work in accordance with <strong>green open access</strong>. Some journals provide similar service by themselves ("issue in progress", "advance articles" etc.), and many researchers use personal websites for storing their work, but preprint servers are still easier to follow.<br/>- Preprints are often posted during formal peer-review, after or along with submission to a journal. Authors can receive more opinions on their reporting of research, for instance by discussions on Twitter or platforms specifically built for public peer-review.<br/>- Preprints can be posted before engaging with journals. In addition to the advantages mentioned above, some publishers employ editors who pick interesting preprints and invite their authors to the peer-review process. Moreover, there are fields where journal publication can be unnecessary (an example is mathematics: work of G. Perelman presented only in preprints was awarded Fields medal).<br/><br/>Preprints are also used to speed up the circulation of scientific information. Depending on the field, rapid information exchange can aid crisis situations (recent example: Zika), a proliferation of new technologies, scientific disputes, or simply shorten waiting time for getting out the results. Preprints also support scientists on the individual level, as those works can be earlier listed in funding proposals or career summaries.<br/><br/>Knowledge Browser at this moment indexes preprints from the following servers: arXiv (physics, mathematics, and other quantitative sciences), bioRxiv (biology), chemRxiv (chemistry), NEP RePEc (economy and politics), AgriXiv (agriculture), BodoArXiv (medieval studies), EarthArXiv (planetary sciences), EcoEvoRxiv (ecology and evolution), ECSarXiv (electrochemistry), engrXiv (engineering), LawArXiv (law research), MarXiv (marine sciences), MediArXiv (media research), MetaArXiv (meta-research), MindRxiv (health sciences), NutriXiv (nutritional sciences), PaleorXiv (paleontology), PsyArXiv (psychology), SocArXiv (sociology), SportRxiv (health sciences), LIS Scholarship Archive (all sciences), medRxiv (health sciences), PeerJ Preprints (biology), Preprints.org (all sciences), viXra (all sciences), ESSOAr (planetary and space sciences), PhilSci (philosophy), NBER (economy and politics).</div></div></div>';
      toWrite += '</div></div></div></div><!--<a class="border-top px-3 py-2 d-block text-gray" href="#"><small class="font-weight-medium"><i class="mdi mdi-chevron-down mr-2"></i>View All</small></a>--></div></div></div>';
      toWrite += '<div class="row" style="margin-top:1rem"><div class="col-12 equel-grid"><div class="grid"><div class="grid-body chart-card"><div class="d-flex justify-content-between"><p class="card-title">project communications</p></div><div class="vertical-timeline-wrapper"><div class="timeline-vertical dashboard-timeline"><div class="activity-log">';

      toWrite += '<div class="row" style="padding-bottom:1.5rem"><div class="col-12 col-md-9"><p class="log-name">new feature</p><div class="log-details">summaries for specific sciences have been implemented</div></div><div class="col-12 col-md-3"><small class="log-time">21st July 2019</small></div></div>';
      toWrite += '<div class="row" style="padding-bottom:1.5rem"><div class="col-12 col-md-9"><p class="log-name">changes to the search engine</p><div class="log-details">multiple queries can be combined by comma; results with relevance under 2/10 are excluded</div></div><div class="col-12 col-md-3"><small class="log-time">15th July 2019</small></div></div>';
      toWrite += '<div class="row" style="padding-bottom:1.5rem"><div class="col-12 col-md-9"><p class="log-name">new feature</p><div class="log-details">accounts & notifications have been implemented</div></div><div class="col-12 col-md-3"><small class="log-time">9th July 2019</small></div></div>';
      toWrite += '<div class="row" style="padding-bottom:1.5rem"><div class="col-12 col-md-9"><p class="log-name">new feature</p><div class="log-details">popular term monitoring has been implemented</div></div><div class="col-12 col-md-3"><small class="log-time">3rd July 2019</small></div></div>';
      toWrite += '<div class="row" style="padding-bottom:1.5rem"><div class="col-12 col-md-9"><p class="log-name">medRxiv integrated with kb:preprints</p><div class="log-details">new medical preprint server has been integrated with the project</div></div><div class="col-12 col-md-3"><small class="log-time">26th June 2019</small></div></div>';
      toWrite += '<div class="row"><div class="col-12 col-md-9"><p class="log-name">first public release of kb:preprints</p><div class="log-details">knowledge browser has started at knowledgebrowser.org</div></div><div class="col-12 col-md-3"><small class="log-time">25th June 2019</small></div></div>';

      toWrite += '</div></div></div></div><!--<a class="border-top px-3 py-2 d-block text-gray" href="#"><small class="font-weight-medium"><i class="mdi mdi-chevron-down mr-2"></i>View All</small></a>--></div></div></div>';

      fs.writeFile('./views/preprint-homepage.handlebars', toWrite, (err) => {
        if (err) reject(err);
        resolve('Successfully written stats to file.');
      });
    }).catch((err) => {
      reject(err.toString());
    });
  });
};
