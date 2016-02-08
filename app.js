global.__dir = __dirname;
// core modules
var util = require(__dir + "/core/util");
var sessionManager = require(__dir + "/core/session/session-manager");
var httpServer = require(__dir + "/core/net/http-server");
var controllerLoader = require(__dir + "/core/routing/controller-loader");
var routerLoader = require(__dir + "/core/routing/route-loader");
var httpConnection = require(__dir + "/core/net/http-connection");
var socketIOConnection = require(__dir + "/core/net/socket-io-connection");
// config files
var packageCfg = require(__dir + "/package.json");
var bootstrapPaths = require(__dir + "/config/paths");
var controllers = require(__dir + "/start/controllers");
var routes = require(__dir + "/start/routes");
var appCfg = require(__dir + "/config/app");
var sessionCfg = require(__dir + "/config/session");

var App = function () {
    this.start = function () {
        sessionManager.start(sessionCfg);
        controllerLoader.loadDirectory(__dir + bootstrapPaths.controllers);
        controllerLoader.loadConfiguration(controllers);
        httpConnection.listen(httpServer);
        socketIOConnection.listen(httpServer, sessionManager);
        routerLoader.load(controllerLoader, httpConnection, socketIOConnection, sessionManager);
        routes(routerLoader);
        httpServer.listen(appCfg.port, sessionManager);
        util.log("");
        util.log("   /|| ||\\ | ||  " + packageCfg.name + " - version " + packageCfg.version);
        util.log("  /_|| ||_| \\||  " + packageCfg.homepage);
        util.log("");
        util.log(" Start time:  " + util.now());
        util.log(" Port:        " + appCfg.port);
        util.log(" Debug mode:  " + appCfg.debug);
        process.on("uncaughtException", function (err) {
            console.error("uncaughtException: " + err.message);
            console.error(err.stack);
        });
    };
};
(new App()).start();
