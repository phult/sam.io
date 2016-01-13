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
    this.listeners = [];
    this.server = http.createServer(function (req, res) {
        req.session = self.sessionManager.initHTTPSession(req, res);
        for (var i = 0; i < self.listeners.length; i++) {
            self.listeners[i].onConnection(req, res);
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
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] == listener) {
                isExisted = true;
                break;
            }
        }
        if (!isExisted) {
            this.listeners.push(listener);
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
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] == listener) {
                itemIdx = i;
                break;
            }
        }
        if (itemIdx > -1) {
            this.listeners.splice(itemIdx, 1);
            retval = true;
        }
        return retval;
    };
}