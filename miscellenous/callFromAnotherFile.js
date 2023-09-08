const connectToVega = require('./authenticateWithVega')
const authenticateVega = require('../getVegaToken')

/*
var token = authenticateVega.getVegaToken()
console.log("token received: "+ JSON.stringify(token));
*/

var token = authenticateVega.getToken()
console.log("token received: "+ JSON.stringify(token));

// connectToVega.makePost()

