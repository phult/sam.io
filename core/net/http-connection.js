/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new HttpConnection();
/** Imports **/
var event = require(__dir + "/core/app/event");
/** Classes **/
function HttpConnection() {
    this.postAPIs = [];
    this.getAPIs = [];
    this.assetAPI = null;
    this.listen = function (httpServer) {
        httpServer.addConnectionListener(this);
    };
    this.onConnection = function (req, res) {
        // Fire event
        event.fire("connection.http.request", req);
        // Pass to listeners
        var self = this;
        var url = req.url;
        if (req.method == "GET") {
            var callback = getCallback.bind(this)("GET", url);
            if (callback != null) {
                req.inputs = getInputs(url, req);
                req.baseUrl = getBaseUrl(url);
                callback(req, res, url);
            } else {
                res.writeHead(404, {"Content-Type": "application/json"});
                res.end(JSON.stringify({
                    status: 404,
                    result: "page not found"
                }));
            }
        } else if (req.method == "POST") {
            var body = "";
            req.on("data", function (data) {
                body += data;
                // Too much POST data, close the connection!
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on("end", function () {
                req.inputs = getInputs(body, req);
                req.baseUrl = getBaseUrl(url);
                var callback = getCallback.bind(self)("POST", url);
                if (callback != null) {
                    callback(req, res);
                } else {
                    res.writeHead(404, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({
                        status: 404,
                        result: "page not found"
                    }));
                }
            });
        }
    };
    this.get = function (url, callback) {
        this.getAPIs[url] = callback;
    };
    this.post = function (url, callback) {
        this.postAPIs[url] = callback;
    };
    this.asset = function (callback) {
        this.assetAPI = callback;
    };
    /** Utils **/
    function getCallback(type, url) {
        var retval;
        if (type.toUpperCase() === "GET") {
            url = url.split("?")[0];
            retval = this.getAPIs[url];
            if (retval == null) {
                retval = this.assetAPI;
            }
        } else if (type.toUpperCase() === "POST") {
            retval = this.postAPIs[url];
        }
        return retval;
    }
    function getInputs(url, request) {
        var retval = {};
        if (request.headers["content-type"] != null && request.headers["content-type"].indexOf("application/json") >= 0) {
            retval = JSON.parse(url);
        } else {
            if (request.method == "POST") {
                url = "?" + url;
            }
            url = decodeURIComponent(url);
            url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value) {
                        retval[key] = value;
                    });
        }
        return retval;
    }
    function getBaseUrl(url) {
        return url.split("?")[0];
    }
}