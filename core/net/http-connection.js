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
    this.methods = ["get", "post", "put", "delete"];
    this.requestCallbacks = [];
    this.assetAPI = null;
    this.init = function() {
        this.initRequestCallbacks();
    }
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
        } else {
            var body = "";
            var contentType = req.headers["content-type"];
            req.on("data", function (data) {
                body += data;
                // Too much POST data, close the connection!
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on("end", function () {
                req.inputs = getInputs(body, req.method, contentType);
                req.baseUrl = getBaseUrl(url);
                var callback = getCallback.bind(self)(req.method, url);
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
    this.initRequestCallbacks = function() {
        var self = this;
        for (var i = 0; i < self.methods.length; i++) {
            var method = self.methods[i];
            self[method] = function(method) {
                return function (url, callback) {
                    self.addRequestCallback(method, url, callback);
                };
            }(method);
        }
    };
    this.asset = function (callback) {
        this.assetAPI = callback;
    };
    /** Utils **/
    this.addRequestCallback = function (method, url, callbackFn) {
        method = method.toUpperCase();
        var methodCallbacks = null;
        if (this.requestCallbacks[method] == null) {
            methodCallbacks = [];
        } else {
            methodCallbacks = this.requestCallbacks[method];
        }
        methodCallbacks[url] = callbackFn;
        this.requestCallbacks[method] = methodCallbacks;
    }
    function getCallback(method, url) {
        var retval = {
            urlInputs: [],
            url: url,
            fn: null
        };
        method = method.toUpperCase();
        if (method === "GET") {
            url = url.split("?")[0];
            retval.fn = this.requestCallbacks[method][url];
            // Match url with params
            if (retval.fn == null) {
                var routeParams = [];
                var urlRegex = null;
                var urlMatches = null;
                for (var route in this.requestCallbacks[method]) {
                    routeParams = route.match(/({[a-zA-Z0-9]+})/g);
                    if (routeParams != null && routeParams.length > 0) {
                        urlRegex = new RegExp(route.replace(/({[a-z]+})/g, "([^\/]+)"), "g");
                        urlMatches = url.match(urlRegex);
                        if (urlMatches != null && urlMatches.length === 1) {
                            for (var i = 0; i < routeParams.length; i++) {
                                retval.urlInputs[routeParams[i].replace(/([{}]+)/g, "")] = url.replace(urlRegex, "$" + (i + 1));
                            }
                            retval.fn = this.requestCallbacks[method][route];
                            break;
                        }
                    }
                }
            }
            // Match asset url
            if (retval.fn == null && retval.urlInputs.length === 0) {
                retval.fn = this.assetAPI;
            }
        } else {
            retval.fn = this.requestCallbacks[method][url];
        }
        return retval;
    }
    function getInputs(inputString, method, contentType) {
        var retval = {};
        if (contentType != null && contentType.indexOf("json") > 0) {
            retval = JSON.parse(inputString);
        } else {
            if (method !== "GET") {
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
    this.init();
}
