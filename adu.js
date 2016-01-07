// core modules
var utils = require('./cores/util');
var httpServer = require('./cores/net/http-server');
var controllerLoader = require('./cores/loader/controller-loader');
var routerLoader = require('./cores/loader/route-loader');
var httpConnection = require('./cores/net/http-connection');
var socketIOConnection = require('./cores/net/socket-io-connection');
// config for start
var controllers = require('./start/controllers');
var routes = require('./start/routes');
// config files
var appCfg = require('./config/app');

var Adu = function () {
    this.start = function () {
        controllerLoader.loadConfigFile(controllers);
        httpConnection.listen(httpServer);
        socketIOConnection.listen(httpServer);
        routerLoader.load(controllerLoader, httpConnection, socketIOConnection);
        routes(routerLoader);
        httpServer.listen(appCfg.port);
        utils.log("=============================================================");
        utils.log("Adu: live to fight!");
        utils.log("-------------------------------------------------------------");
        utils.log("- " + utils.now());
        utils.log("- port: " + appCfg.port);
        utils.log("- debug: " + appCfg.debug);
        utils.log("=============================================================");
    };
};
(new Adu()).start();


process.on('uncaughtException', function (err) {
    console.error('uncaughtException: ' + err.message);
    console.error(err.stack);
});
