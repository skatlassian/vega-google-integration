const { exec } = require("child_process");
const execSync = require("child_process").execSync;
const authenticateVega = require('./getVegaToken')

function getVegaToken(){
    var token
     exec("atlas slauth token -a vega -e prod --output http", (error, stdout, stderr) => {
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
    return execSync("atlas slauth token -a vega -e prod --output http").toString();

}


// var token = getToken()
// console.log("getToken"+ token)


module.exports = { getVegaToken }
module.exports = { getToken }