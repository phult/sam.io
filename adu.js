// core modules
var util = require('./core/util');
var sessionManager = require('./core/session/session-manager');
var httpServer = require('./core/net/http-server');
var controllerLoader = require('./core/loader/controller-loader');
var routerLoader = require('./core/loader/route-loader');
var httpConnection = require('./core/net/http-connection');
var socketIOConnection = require('./core/net/socket-io-connection');
// config for start
var controllers = require('./start/controllers');
var routes = require('./start/routes');
// config files
var appCfg = require('./config/app');
var sessionCfg = require('./config/session');

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
        util.log("- start time: " + util.now());
        util.log("- port: " + appCfg.port);
        util.log("- debug: " + appCfg.debug);
        util.log("=============================================================");
    };
};
(new Adu()).start();


process.on('uncaughtException', function (err) {
    console.error('uncaughtException: ' + err.message);
    console.error(err.stack);
});
