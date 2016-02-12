/**
 * @author Phuluong
 * December 27, 2015
 */
/** Exports **/
module.exports = IO;
/** Imports **/
var fs = require("fs");
/** Modules **/
var IOBuilder = require('./io-builder');
function IO(autoloader, routeName, sessionManager) {
    this.autoLoader = autoloader;
    this.routeName = routeName;
    this.sessionManager = sessionManager;
    this.p = {
        type: "http",
        status: 200,
        headers: {},
        isToAll: false,
        toEvent: null,
        tos: [],
        toExpections: [],
        toCriterias: [],
        toExpectionCriterias: []
    };
    this.bindHttp = function (req, res) {
        this.type = "http";
        this.request = req;
        this.response = res;
        this.inputs = req.inputs;
        this.session = req.session;
    };
    this.bindSocketIO = function (data, session) {
        this.type = "socket.io";
        this.session = session;
        this.inputs = data;
    };
    /**
     * Return a JSON response
     * @param {jsonString | object} data
     */
    this.json = function (data) {
        var self = this;
        this.header("Content-Type", "application/json");
        this.header("Connection", "close");
        this.build();
        this.p.tos.forEach(function (session) {
            if (session.socket != null) {
                session.socket.emit(self.p.toEvent, data);
            }
        });
        if (this.type === "http") {
            this.response.end((!(typeof data === "string")) ? JSON.stringify(data) : data);
        }
    };
    /**
     * Return a custom response
     * @param {string} content
     */
    this.make = function (content) {
        var self = this;
        this.header("Content-Type", "text/html; charset=UTF-8");
        this.header("Connection", "close");
        this.build();
        this.p.tos.forEach(function (session) {
            session.socket.emit(self.p.toEvent, content);
        });
        if (this.type === "http") {
            this.response.end(content);
        }
    };
    /**
     * Return a file response
     * @param {string} filePath
     * @param {array} headers
     */
    this.download = function (filePath) {
        this.header("Connection", "close");
        this.build();
        var file = fs.readFileSync(filePath);
        this.response.end(file, 'binary');
    };
    /**
     * Render a view response
     * @param {View} view
     * @param {object} data
     */
    this.render = function (view, data) {
        this.header("Connection", "close");
        this.build();
        // TODO
    };
    /**
     * Create a new redirect response to a action
     * @param {String|Function} action
     */
    this.delegate = function (action) {
        if (typeof action === "function") {
            action(this);
        } else if (typeof action === "string") {
            this.autoLoader.getAction(action)(this);
        }
    };
    /**
     * Create a new redirect response to a url
     * @param {String|Function} url
     */
    this.redirect = function (url) {
        this.status(301).header("Location", url).make("");

    };
}
IO.prototype = new IOBuilder();

