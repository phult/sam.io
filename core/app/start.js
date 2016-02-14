module.exports = new Application();
var util = require(__dir + "/core/app/util");
var sessionManager = require(__dir + "/core/session/session-manager");
var httpServer = require(__dir + "/core/net/http-server");
var autoLoader = require(__dir + "/core/loader/auto-loader");
var routerLoader = require(__dir + "/core/loader/route-loader");
var httpConnection = require(__dir + "/core/net/http-connection");
var socketIOConnection = require(__dir + "/core/net/socket-io-connection");
var routes = require(__dir + "/start/routes");

var packageCfg = require(__dir + "/package.json");
var pathsCfg = require(__dir + "/config/paths");
var appCfg = require(__dir + "/config/app");
var sessionCfg = require(__dir + "/config/session");

function Application() {
    this.start = function () {
        displayAppInfo();
        boot();
        displayConfiguration();
        handleExceptions();
    };
    function boot() {
        sessionManager.start(sessionCfg);
        autoLoader.loadConfiguration(pathsCfg.autoload);
        httpConnection.listen(httpServer);
        socketIOConnection.listen(httpServer, sessionManager);
        routerLoader.load(autoLoader, httpConnection, socketIOConnection, sessionManager);
        routes(routerLoader);
        httpServer.listen(appCfg.port, sessionManager);
    }
    function handleExceptions() {
        process.on("uncaughtException", function (err) {
            console.error("uncaughtException: " + err.message);
            console.error(err.stack);
        });
    }
    function displayAppInfo() {
        util.log("===========================================================");
        util.log("");
        util.log("  /|| ||\\ | ||  " + packageCfg.name + " - version " + packageCfg.version);
        util.log(" /_|| ||_| \\||  " + packageCfg.homepage);
        util.log("");
    }
    function displayConfiguration() {
        util.log("Start time:  " + util.now());
        util.log("Port:        " + appCfg.port);
        util.log("Debug mode:  " + appCfg.debug);
    }
}