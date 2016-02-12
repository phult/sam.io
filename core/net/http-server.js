/**
 * @author Phuluong
 * May 13, 2015 5:02:26 PM
 */

/** Imports **/
var http = require("http");
/** Exports **/
module.exports = new HttpServer();
/** Modules **/
function HttpServer() {
    var self = this;
    var listeners = [];
    this.server = http.createServer(function (req, res) {
        req.session = self.sessionManager.initHTTPSession(req, res);
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].onConnection(req, res);
        }
    });
    /**
     * Start listening connections
     * @param {int} port
     */
    this.listen = function (port, sessionManager) {
        this.sessionManager = sessionManager;
        this.server.listen(port);
    };
    this.getServer = function () {
        return this.server;
    };
    /**
     * Add a connection listener
     * @param {Object} listener
     * @returns {Boolean}
     */
    this.addConnectionListener = function (listener) {
        var retval = false;
        var isExisted = false;
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == listener) {
                isExisted = true;
                break;
            }
        }
        if (!isExisted) {
            listeners.push(listener);
            retval = true;
        }
        return retval;
    };
    /**
     * Remove a connection listener 
     * @param {Object} listener Object contain onConnection(req, res);
     * @returns {Boolean}
     */
    this.removeConnectionListener = function (listener) {
        var retval = false;
        var itemIdx = -1;
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == listener) {
                itemIdx = i;
                break;
            }
        }
        if (itemIdx > -1) {
            listeners.splice(itemIdx, 1);
            retval = true;
        }
        return retval;
    };
}