const { spawn } = require("child_process");
const api = spawn("npm.cmd", ["run", "api"]);
const ui = spawn("npm.cmd", ["run", "ui"]);

api.stdout.on("data", log.bind(null, "api", "out"));
api.stderr.on("data", log.bind(null, "api", "err"));
api.on("close", log.bind(null, "api", "close"));

ui.stdout.on("data", log.bind(null, "ui", "out"));
ui.stderr.on("data", log.bind(null, "ui", "err"));
ui.on("close", log.bind(null, "ui", "close"));

function log(proc, stream, data) {
    let message = `[std${stream}::${proc}] `;
    message += data.toString().replace(/\n$/g, "");
    console.log(message);
}