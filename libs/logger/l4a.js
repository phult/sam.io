/**
 * @author Phuluong
 * Feb 14, 2016
 */
/** Exports **/
module.exports = L4aLogger;
/** Imports **/
var Logger = require(__dir + "/core/log/logger");
var fs = require("fs");
/** Modules **/
function L4aLogger(obj, config) {
    var colors = {
        normal: "\033[0m",
        info: "\033[0m",
        debug: "\033[32m",
        warning: "\033[33m",
        error: "\033[31m"
    };
    obj = obj == null ? "" : obj;
    this.info = function (msg, outputData) {
        log("info", msg, outputData);
    };

    this.debug = function (msg, outputData) {
        log("debug", msg, outputData);
    };

    this.warning = function (msg, outputData) {
        log("warning", msg, outputData);
    };

    this.error = function (msg, outputData) {
        log("error", msg, outputData);
    };

    function log(type, msg, outputData) {
        if (type === "debug" && config.debug === false) {
            return;
        }
        msg = msg == null ? "" : msg;
        outputData = outputData == null ? "" : outputData;
        objName = (typeof obj === "string") ? obj : obj.constructor.name;
        if (type !== "info") {
            msg = "[" + new Date() + "] [" + type + "] " + objName + ": " + msg;
        }
        console.log(colors[type] + msg + colors.normal, outputData);
        fs.appendFile(config.storage + "/adu.log", msg + " " + (outputData != "" ? JSON.stringify(outputData) : "") + " \r\n", function (err) {});
    }
}
L4aLogger.prototype = new Logger();