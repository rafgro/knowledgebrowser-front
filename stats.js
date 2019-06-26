
const request = require('request');
var fs = require("fs");

exports.doYourJob = function() {

    return new Promise( ( resolve, reject ) => {

        request('http://knowbro-env.223darfg3a.us-east-2.elasticbeanstalk.com:3000/api/stats',
          {timeout: 20000}, (error, response, body) => {

            if( error ) {
                reject( error );
            }
            else {
                
              let results = JSON.parse(body);
                
let toWrite = '<div class="row"><div class="col-md-12 order-md-0"><div class="row"><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-primary no-avatar component-flat mx-auto mb-4"><i class="mdi mdi-file-multiple mdi-2x"></i></div><h2 class="font-weight-medium">'+results[5].lastWeek+'</h2><small class="text-gray d-block mb-3">new preprints in the last week</small>';
let howMuch = 0;
howMuch = ((parseInt(results[5].lastWeek) - parseInt(results[10].previousWeek)) / parseInt(results[10].previousWeek)) * 100;
if( howMuch >= 0 ) {
    if( howMuch >= 100 ) howMuch = "∞";
    else howMuch = howMuch.toFixed(1);
    toWrite += '<small class="font-weight-medium text-success"><i class="mdi mdi-menu-up"></i><span class="animated-count">'+howMuch+'</span>%</small>';
} else {
    if( howMuch <= -100 ) howMuch = "∞";
    else howMuch = (howMuch*(-1)).toFixed(1);
    toWrite += '<small class="font-weight-medium text-gray"><i class="mdi mdi-menu-down"></i><span class="animated-count">'+howMuch+'</span>%</small>';
}
toWrite += '</div></div></div><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-primary no-avatar component-flat mx-auto mb-4"><i class="mdi mdi-file mdi-2x"></i></div><h2 class="font-weight-medium">';
if( parseInt(results[3].today) == 0 ) toWrite += 'no';
else toWrite += results[3].today;
toWrite += '</h2><small class="text-gray d-block mb-3">new preprints today</small>';
howMuch = 0;
howMuch = ((parseInt(results[3].today) - parseInt(results[9].yesterday)) / parseInt(results[9].yesterday)) * 100;
if( howMuch >= 0 ) {
    if( howMuch >= 100 ) howMuch = "∞";
    else howMuch = howMuch.toFixed(1);
    toWrite += '<small class="font-weight-medium text-success"><i class="mdi mdi-menu-up"></i><span class="animated-count">'+howMuch+'</span>%</small>';
} else {
    if( howMuch <= -100 ) howMuch = "∞";
    else howMuch = (howMuch*(-1)).toFixed(1);
    toWrite += '<small class="font-weight-medium text-gray"><i class="mdi mdi-menu-down"></i><span class="animated-count">'+howMuch+'</span>%</small>';
}
toWrite += '</div></div></div><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-success no-avatar component-flat mx-auto mb-4"><i class="mdi mdi mdi-server-network mdi-2x"></i></div><h2 class="font-weight-medium">28</h2><small class="text-gray d-block mb-3">preprint servers</small><small class="font-weight-medium text-success">newest: medRxiv</small></div></div></div><div class="col-6 col-md-3 equel-grid"><div class="grid d-flex flex-column align-items-center justify-content-center homepage-grid"><div class="grid-body text-center homepage-card"><div class="profile-img img-rounded bg-inverse-warning no-avatar component-flat mx-auto mb-4"><i class="mdi mdi-fire mdi-2x"></i></div><h2 class="font-weight-medium">arXiv</h2><small class="text-gray d-block mb-3">most active server</small><small class="text-gray">';
toWrite += (parseInt(results[11].preprintServers[0].lastMonth) / parseInt(results[11].preprintServers[1].lastMonth)).toFixed(1);
toWrite += 'x more than 2nd</small></div></div></div></div></div></div>';
toWrite += '<div class="row"><div class="col-12 col-md-8 equel-grid"><div class="grid homepage-grid"><div class="grid-body py-3"><p class="card-title ml-n1">most popular preprint servers</p></div><div class="table-responsive"><table class="table table-hover table-sm"><thead><tr class="solid-header"><th colspan="2" class="pl-4"> </th><th>last month</th><th>last week <i class="mdi mdi-menu-down"></i></th><th>newest</th></tr></thead><tbody>';
let limit = 0;
for( let element of results[11].preprintServers ) {
    toWrite += '<tr><td class="pr-0 pl-4"><img class="profile-img img-sm" src="https://www.placehold.it/50x50" alt="profile image"></td><td class="pl-md-0"><small class="text-black font-weight-medium d-block">'+element.name+'</small></td><td><small>'+element.lastMonth+'</small></td><td><small>'+element.lastWeek+'</small></td><td>'+element.lastPreprint+'</td></tr>';
    limit++;
    if( limit >= 12 ) break;
}
toWrite += '</tbody></table></div></div></div><div class="col-12 col-md-4 equel-grid"><div class="row flex-grow"><div class="col-12 equel-grid"><div class="grid widget-revenue-card homepage-grid"><div class="grid-body d-flex flex-column h-100 chart-card"><div class="split-header"><p class="card-title">latest preprints</p></div>';
results[8].lastPreprints.forEach( element => {
    toWrite += '<div class="mt-1"><div class="content-wrapper v-centered"><small class="text-muted">'+element.date.toString().substring(0,10)+'</small></div><p class="text-gray mathjax"><a href="'+element.link+'">'+unescape(element.title)+'</a></p></div>';
});
toWrite += '</div></div></div></div></div></div><div class="row"><div class="col-12 equel-grid"><div class="grid"><div class="grid-body chart-card"><div class="d-flex justify-content-between"><p class="card-title">project communications</p></div><div class="vertical-timeline-wrapper"><div class="timeline-vertical dashboard-timeline"><div class="activity-log">';
toWrite += '<div class="row" style="padding-bottom:1.5rem"><div class="col-12 col-md-9"><p class="log-name">medRxiv integrated with kb:preprints</p><div class="log-details">new medical preprint server has been integrated with the project</div></div><div class="col-12 col-md-3"><small class="log-time">26th June 2019</small></div></div>';
toWrite += '<div class="row"><div class="col-12 col-md-9"><p class="log-name">first public release of kb:preprints</p><div class="log-details">knowledge browser has started at knowledgebrowser.org</div></div><div class="col-12 col-md-3"><small class="log-time">25th June 2019</small></div></div>';
toWrite += '</div></div></div></div><!--<a class="border-top px-3 py-2 d-block text-gray" href="#"><small class="font-weight-medium"><i class="mdi mdi-chevron-down mr-2"></i>View All</small></a>--></div></div></div>';

fs.writeFile("./views/preprint-homepage.handlebars", toWrite, (err) => {
  if (err) reject(err);
  resolve("Successfully written stats to file.");
});

            }

        } );

    });

};