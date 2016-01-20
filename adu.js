global.__base = __dirname;
// core modules
var util = require(__base + "/core/util");
var sessionManager = require(__base + "/core/session/session-manager");
var httpServer = require(__base + "/core/net/http-server");
var controllerLoader = require(__base + "/core/loader/controller-loader");
var routerLoader = require(__base + "/core/loader/route-loader");
var httpConnection = require(__base + "/core/net/http-connection");
var socketIOConnection = require(__base + "/core/net/socket-io-connection");
// config for start
var controllers = require(__base + "/start/controllers");
var routes = require(__base + "/routes");
// config files
var appCfg = require(__base + "/config/app");
var sessionCfg = require(__base + "/config/session");

var Adu = function () {
    this.start = function () {
        sessionManager.start(sessionCfg);
        controllerLoader.loadConfigFile(controllers);
        httpConnection.listen(httpServer);
        socketIOConnection.listen(httpServer, sessionManager);
        routerLoader.load(controllerLoader, httpConnection, socketIOConnection, sessionManager);
        routes(routerLoader);
        httpServer.listen(appCfg.port, sessionManager);
        util.log("=============================================================");
        util.log(appCfg.name + " is ready!");
        util.log("-------------------------------------------------------------");
        util.log("start time: " + util.now());
        util.log("port: " + appCfg.port);
        util.log("debug: " + appCfg.debug);
        util.log("=============================================================");
        process.on("uncaughtException", function (err) {
            console.error("uncaughtException: " + err.message);
            console.error(err.stack);
        });
    };
};
(new Adu()).start();
