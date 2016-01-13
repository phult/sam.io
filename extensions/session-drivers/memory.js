/**
 * @author Phuluong
 * Jan 11, 2016
 */
module.exports = Memory;
var Driver = require("../../core/session/driver");
function Memory(config) {
    this.config = config;
    var sessionData = [];
    this.get = function (sessionId, key, defaultValue) {
        var retval = defaultValue;
        key = key.hash();
        if (sessionData[sessionId] != null && sessionData[sessionId][key] != null) {
            retval = sessionData[sessionId][key];
        }
        return retval;
    };
    this.set = function (sessionId, key, value) {
        key = key.hash();
        if (sessionData[sessionId] == null) {
            sessionData[sessionId] = {};
        }
        sessionData[sessionId][key] = value;
        return true;
    };
    this.destroy = function (sessionId) {
        delete sessionData[sessionId];
    };
}
Memory.prototype = new Driver();