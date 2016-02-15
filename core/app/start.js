module.exports = new Application();

var config = require(__dir + "/core/app/config");
var util = require(__dir + "/core/app/util");
var sessionManager = require(__dir + "/core/session/session-manager");
var httpServer = require(__dir + "/core/net/http-server");
var autoLoader = require(__dir + "/core/loader/auto-loader");
var routerLoader = require(__dir + "/core/loader/route-loader");
var httpConnection = require(__dir + "/core/net/http-connection");
var socketIOConnection = require(__dir + "/core/net/socket-io-connection");
var routes = require(__dir + "/start/routes");
var packageCfg = require(__dir + "/package.json");
var loggerFactory = require(__dir + "/core/log/logger-factory");

function Application() {
    var logger = null;
    this.start = function () {
        logger = loggerFactory.getLogger(this);
        displayAppInfo();
        boot();
        displayConfiguration();
        handleExceptions();
    };
    function boot() {
        sessionManager.start(config.get("session"));
        autoLoader.loadConfiguration(config.get("paths.autoload"));
        httpConnection.listen(httpServer);
        socketIOConnection.listen(httpServer, sessionManager);
        routerLoader.load(autoLoader, httpConnection, socketIOConnection, sessionManager);
        routes(routerLoader);
        httpServer.listen(config.get("app.port"), sessionManager);
    }
    function handleExceptions() {
        process.on("uncaughtException", function (err) {
            logger.error("uncaughtException: " + err.message);
            logger.error(err.stack);
        });
    }
    function displayAppInfo() {
        logger.info("===========================================================");
        logger.info("");
        logger.info("  /|| ||\\ | ||  " + packageCfg.name + " - version " + packageCfg.version);
        logger.info(" /_|| ||_| \\||  " + packageCfg.homepage);
        logger.info("");
    }
    function displayConfiguration() {
        logger.info("Start time:  " + util.now());
        logger.info("Port:        " + config.get("app.port"));
        logger.info("Debug mode:  " + config.get("app.debug"));
    }
}