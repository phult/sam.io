/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new RouteLoader();
/** Imports **/
var Response = require("../io/response");
/** Modules **/
function RouteLoader() {
    this.load = function (controllerLoader, httpConnection, socketIOConnection) {
        this.socketIOConnection = socketIOConnection;
        this.httpConnection = httpConnection;
        this.controllerLoader = controllerLoader;
    };
    this.any = function (routeName, controllerMethod) {
        this.io(routeName, controllerMethod);
        this.get(routeName, controllerMethod);
        this.post(routeName, controllerMethod);
    };
    this.io = function (routeName, controllerMethod) {
        var self = this;
        this.socketIOConnection.addMessageListener(routeName, function (data, session) {
            var response = new Response(routeName, self.socketIOConnection);
            response.bindSocketIO(data, session);
            controllerLoader.getControllerMethod(controllerMethod)(response);
        });
    };
    this.get = function (routeName, controllerMethod) {
        var self = this;
        this.httpConnection.get(routeName, function (req, res) {
            var response = new Response(routeName, self.socketIOConnection);
            response.bindHttp(req, res);
            self.controllerLoader.getControllerMethod(controllerMethod)(response);
        });
    };
    this.post = function (routeName, controllerMethod) {
        var self = this;
        this.httpConnection.post(routeName, function (req, res) {
            var response = new Response(routeName, self.socketIOConnection);
            response.bindHttp(req, res);
            self.controllerLoader.getControllerMethod(controllerMethod)(response);
        });
    };
}