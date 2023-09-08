var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../env.properties');

console.log(properties.get("database"));
console.log(properties.get("hostname"));
console.log(properties.get("username"));
console.log(properties.get("password"));


// https://www.w3schools.io/file/properties-read-write-javascript/#google_vignette
// https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f
