exports.xmlFile = function() {

let listOfUrls = new Array();
listOfUrls.push('https://knowledgebrowser.org/preprints');
listOfUrls.push('https://knowledgebrowser.org/preprints/about');
listOfUrls.push('https://knowledgebrowser.org/preprints/terms-and-privacy');

listOfUrls.push('https://knowledgebrowser.org/preprints/search?q=gravity+waves');
listOfUrls.push('https://knowledgebrowser.org/preprints/search?q=CRISPR');
listOfUrls.push('https://knowledgebrowser.org/preprints/search?q=generative+adversarial+networks');
listOfUrls.push('https://knowledgebrowser.org/preprints/search?q=exoplanets');
listOfUrls.push('https://knowledgebrowser.org/preprints/search?q=neural+networks');

let finalText = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
listOfUrls.forEach( url => {
    finalText += '<url><loc>'+url+'</loc></url>'
});
finalText += '</urlset>';

return finalText;

};