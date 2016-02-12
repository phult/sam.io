/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new HttpConnection();
/** Imports **/
/** Classes **/
function HttpConnection() {
    this.postAPIs = [];
    this.getAPIs = [];
    this.listen = function (httpServer) {
        httpServer.addConnectionListener(this);
    };
    this.onConnection = function (req, res) {
        var self = this;
        var url = req.url;
        if (req.method == "GET") {
            var callback = getCallback.bind(this)("GET", url);
            if (callback != null) {
                req.inputs = self.getInputs(url);
                callback(req, res, url);
            } else {
                res.writeHead(404, {"Content-Type": "application/json"});
                res.end(JSON.stringify({
                    status: 404,
                    result: "page not found"
                }));
            }
        } else if (req.method == "POST") {
            var body = "?";
            req.on("data", function (data) {
                body += data;
                // Too much POST data, close the connection!
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on("end", function () {
                req.inputs = self.getInputs(body);
                var callback = getCallback.bind(this)("POST", url);
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
    this.getInputs = function (url) {
        var retval = {};
        url = decodeURIComponent(url);
        url.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function (m, key, value) {
                    retval[key] = value;
                });
        return retval;
    };
    this.get = function (url, callback) {
        this.getAPIs[url] = callback;
    };
    this.post = function (url, callback) {
        this.postAPIs[url] = callback;
    };
    /** Utils **/
    function getCallback(type, url) {
        var retval;
        if (type.toUpperCase() === "GET") {
            url = url.split("?")[0];
            retval = this.getAPIs[url];
        } else if (type.toUpperCase() === "POST") {
            retval = this.postAPIs[url];
        }
        return retval;
    }
}