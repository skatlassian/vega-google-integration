const { exec } = require("child_process");
const execSync = require("child_process").execSync;
const authenticateVega = require('./getVegaToken')
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../env.properties');

function getVegaToken(){
    var token
     exec(`${properties.get("TOKEN_QUERY")}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        token = stdout
        
        
    })


    return token

}


function getToken(){
    return execSync(`${properties.get("TOKEN_QUERY")}`).toString();

}


// var token = getToken()
// console.log("getToken"+ token)


module.exports = { getVegaToken }
module.exports = { getToken }