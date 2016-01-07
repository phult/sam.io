/**
 * @author Phuluong
 * December 27, 2015
 */
/** Exports **/
module.exports = Response;
/** Modules **/
var ResponseBuilder = require('../io/response-builder');
function Response(routeName, ioConnection) {
    this.routeName = routeName;
    this.ioConnection = ioConnection;
    this.bindHttp = function (req, res) {
        this.type = "http";
        this.request = req;
        this.response = res;
        this.inputs = req.inputs;
    };
    this.bindSocketIO = function (data, session) {
        this.type = "socketIO";
        this.session = session;
        this.inputs = data;
    };
    /**
     * Return a JSON response
     * @param {jsonString | object} data
     * @param {int} status
     * @param {array} headers
     */
    this.json = function (data) {
        var self = this;
        this.header("Content-Type", "application/json");
        this.build();
        this.p.tos.forEach(function (session) {
            session.socket.emit(self.p.toEvent, data);
        });
        if (this.type === "http") {
            this.response.end((!(typeof data === "string")) ? JSON.stringify(data) : data);
        }
    };
    /**
     * Return a custom response
     * @param {string} content
     * @param {int} status
     * @param {array} headers
     */
    this.make = function (content) {
        var self = this;
        this.header("Content-Type", "text/html; charset=UTF-8");
        this.build();
        this.p.tos.forEach(function (session) {
            session.socket.emit(self.p.toEvent, content);
        });
        if (this.type === "http") {
            this.response.end(content);
        }
    };
    /**
     * Return a view response
     * @param {View} view
     * @param {object} data
     * @param {int} status
     * @param {array} headers
     */
    this.view = function (view, data) {
        this.build();
    };
    /**
     * Return a file response
     * @param {View} view
     * @param {string} file
     * @param {string} name
     * @param {array} headers
     */
    this.download = function (file, name) {
        this.build();
    };
}
Response.prototype = new ResponseBuilder();

