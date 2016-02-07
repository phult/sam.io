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
    this.load = function (controllerLoader, httpConnection, socketIOConnection, sessionManager) {
        this.sessionManager = sessionManager;
        this.socketIOConnection = socketIOConnection;
        this.httpConnection = httpConnection;
        this.controllerLoader = controllerLoader;
    };
    this.any = function (routeName, controllerMethod, filters) {
        this.io(routeName, controllerMethod, filters);
        this.get(routeName, controllerMethod, filters);
        this.post(routeName, controllerMethod, filters);
        return this;
    };
    this.io = function (routeName, controllerMethod, filters) {
        var self = this;
        this.socketIOConnection.addMessageListener(routeName, function (data, session) {
            var response = new Response(routeName, self.sessionManager);
            response.bindSocketIO(data, session);
            callControllerMethod(self, controllerMethod, response, filters);
        });
        return this;
    };
    this.get = function (routeName, controllerMethod, filters) {
        var self = this;
        this.httpConnection.get(routeName, function (req, res) {
            var response = new Response(routeName, self.sessionManager);
            response.bindHttp(req, res);
            callControllerMethod(self, controllerMethod, response, filters);
        });
        return this;
    };
    this.post = function (routeName, controllerMethod, filters) {
        var self = this;
        this.httpConnection.post(routeName, function (req, res) {
            var response = new Response(routeName, self.sessionManager);
            response.bindHttp(req, res);
            callControllerMethod(self, controllerMethod, response, filters);
        });
        return this;
    };
    function callControllerMethod(self, controllerMethod, response, filters) {
        if (filters != null && filters.before != null) {
            if (filters.before(response) === false) {
                return;
            }
        }
        self.controllerLoader.getControllerMethod(controllerMethod)(response);
        if (filters != null && filters.after != null) {
            filters.after(response);
        }
    }
}