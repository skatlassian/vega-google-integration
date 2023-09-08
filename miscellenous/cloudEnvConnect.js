const https = require('https');

const options = {
    hostname: 'linux-51415.prod.atl-cd.net',
    path: '/jira/rest/api/2/issue/SCRUM-23',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${properties.get("CLOUD_ENV_TOKEN")}`
    },
  };

  
var url = "https://linux-51415.prod.atl-cd.net/jira/rest/api/2/issue/SCRUM-23"
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