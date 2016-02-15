/**
 * @author Phuluong
 * Feb 14, 2016
 */
/** Exports **/
module.exports = new LoggerFactory();
/** Imports **/
var config = require("../../core/app/config");
/** Modules **/
function LoggerFactory() {
    /**
     * Build a logger instance
     * @param {String|object} obj
     * @returns {Logger}
     */
    this.getLogger = function (obj) {
        var logConfig = config.get("log");
        logConfig.debug = config.get("app.debug");
        return new (require(__dir + logConfig.loggerPath + "/" + logConfig.logger))(obj, logConfig);
    };
}
