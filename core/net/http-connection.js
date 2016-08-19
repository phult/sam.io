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
        if (req.method === "GET") {
            var contentType = req.headers["content-type"];
            var callback = getCallback.bind(this)("GET", url);
            if (callback.fn != null) {
                req.inputs = callback.urlInputs;
                var inputs = getInputs(url, "GET", contentType);
                for (var property in inputs) {
                    req.inputs[property] = inputs[property];
                }
                req.baseUrl = getBaseUrl(url);
                callback.fn(req, res, url);
            } else {
                res.writeHead(404, {"Content-Type": "application/json"});
                res.end(JSON.stringify({
                    status: 404,
                    result: "page not found"
                }));
            }
        } else if (req.method === "POST") {
            var body = "";
            var contentType = req.headers["content-type"];
            req.on("data", function (data) {
                body += data;
                // Too much POST data, close the connection!
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on("end", function () {
                req.inputs = getInputs(body, "POST", contentType);
                req.baseUrl = getBaseUrl(url);
                var callback = getCallback.bind(self)("POST", url);
                if (callback.fn != null) {
                    callback.fn(req, res);
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
        var retval = {
            urlInputs: [],
            url: url,
            fn: null
        };
        if (type.toUpperCase() === "GET") {
            url = url.split("?")[0];
            retval.fn = this.getAPIs[url];
            // Match url with params
            if (retval.fn == null) {
                var routeParams = [];
                var urlRegex = null;
                var urlMatches = null;
                for (var route in this.getAPIs) {
                    routeParams = route.match(/({[a-zA-Z0-9]+})/g);
                    if (routeParams != null && routeParams.length > 0) {
                        urlRegex = new RegExp(route.replace(/({[a-z]+})/g, "([^\/]+)"), "g");
                        urlMatches = url.match(urlRegex);
                        if (urlMatches != null && urlMatches.length === 1) {
                            for (var i = 0; i < routeParams.length; i++) {
                                retval.urlInputs[routeParams[i].replace(/([{}]+)/g, "")] = url.replace(urlRegex, "$" + (i + 1));
                            }
                            retval.fn = this.getAPIs[route];
                            break;
                        }
                    }
                }
            }
            // Match asset url
            if (retval.fn == null && retval.urlInputs.length === 0) {
                retval.fn = this.assetAPI;
            }
        } else if (type.toUpperCase() === "POST") {
            retval.fn = this.postAPIs[url];
        }
        return retval;
    }
    function getInputs(inputString, type, contentType) {
        var retval = {};
        if (contentType != null && contentType.indexOf("json") > 0) {
            retval = JSON.parse(inputString);
        } else {
            if (type === "POST") {
                inputString = "?" + inputString;
            }
            inputString = decodeURIComponent(inputString);
            inputString.replace(/[?&]+([^=&]+)=([^&]*)/gi,
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