const https = require('https');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../env.properties');


const options = {
    hostname: 'getsupport.atlassian.com',
    path: '/rest/api/2/issue/PSSRV-83848',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${properties.get("GSAC_TOKEN")}`
    },
  };

  
var url = "https://getsupport.atlassian.com/rest/api/2/issue/PSSRV-83848"
https.get(options, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    // console.log("data fetched: " + JSON.stringify(data));
    var parsedData = JSON.parse(data)
    console.log("Expand: " + parsedData.expand);


  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});