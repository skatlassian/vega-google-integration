const axios = require('axios');
const authenticateVega = require('./getVegaToken')
var PropertiesReader = require('properties-reader');


var properties = PropertiesReader('../env.properties')

// Define the data you want to send in the POST request


// Define the URL where you want to send the POST request

function getToken(){
  token = authenticateVega.getToken()
  return token
}
function makePost(token){
    var url = `${properties.get("VEGA_URL")}`
  const postData = {
      "query":"query CustomQuery($id: ID!){employee(id: $id){displayName location}}",
      "variables":{"id":"vkgan"},"operationName":"CustomQuery"
  };

console.log(token)
// console.log("")


var config =    { 
  headers: {
      'Content-Type': 'application/json',
      'Authorization': token.replace(/\r?\n|\r/g, '')
}
};


  // Make the POST request
  axios.post(url, postData, config)
    .then((response) => {
      console.log('Response data:', response.data);
    })
    .catch((error) => {
      console.log('Code:', error);
      console.log('Status:', error.code);

      // console.error('Error:', error);
    });


}
var token = getToken()
makePost(token)

  //atlas slauth token -a vega -e prod --output http