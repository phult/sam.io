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
            //console.log("Get:" + url);
            var callback = self.getCallback("GET", url);
            if (callback != null) {
                req.inputs = self.getInputs(url);
                callback(req, res, url);
            } else {
                res.writeHead("Content-Type", "application/json");
                res.end(JSON.stringify({
                    status: "fail",
                    errorCode: "404"
                }));
            }
        } else if (req.method == "POST") {
            //console.log("Post:" + url);
            var body = "?";
            req.on("data", function (data) {
                body += data;
                // Too much POST data, kill the connection!
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on("end", function () {
                req.inputs = self.getInputs(body);
                var callback = self.getCallback("POST", url);
                if (callback != null) {
                    callback(req, res);
                } else {
                    res.writeHead("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        status: "fail",
                        errorCode: "404"
                    }));
                }
            });
        }
    };
    this.getInputs = function (url) {
        var retval = {};
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
    this.getCallback = function (type, url) {
        var retval;
        if (type == "GET") {
            var urls = Object.keys(this.getAPIs);
            for (var i = 0; i < urls.length; i++) {
                if (url.indexOf(urls[i]) == 0) {
                    retval = this.getAPIs[urls[i]];
                    break;
                }
            }
        } else if (type == "POST") {
            retval = this.postAPIs[url];
        }
        return retval;
    };
}