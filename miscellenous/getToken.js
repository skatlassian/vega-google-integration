const { spawn } = require("child_process");
const execSync = require("child_process").execSync;

var r = execSync("atlas slauth token -a vega -e prod --output http").toString();

