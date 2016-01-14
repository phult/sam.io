/**
 * @author Phuluong
 * Jan 11, 2016
 */
module.exports = File;
var Driver = require(__base + "/core/session/driver");
var fs = require("fs");
var util = require(__base + '/core/util');
function File(config) {
    var sessionStorage = config.storage;
    this.get = function (sessionId, key, defaultValue) {
        var retval = defaultValue;
        key = key.hash();
        try {
            var data = fs.readFileSync(sessionStorage + "/" + sessionId + "/" + key, "utf8");
            retval = JSON.parse(data);
        } catch (e) {
        }
        return retval;
    };
    this.set = function (sessionId, key, value) {
        var retval = true;
        key = key.hash();
        if (!(typeof value === "string")) {
            value = JSON.stringify(value);
        }
        try {
            fs.mkdir(sessionStorage + "/" + sessionId, 0777, function (err, data) {
                fs.writeFileSync(sessionStorage + "/" + sessionId + "/" + key, value);
            });
        } catch (e) {
            retval = false;
        }
        return retval;
    };
    this.destroy = function (sessionId) {
        util.deleteDirectory(sessionStorage + "/" + sessionId);
    };
}
File.prototype = new Driver();
