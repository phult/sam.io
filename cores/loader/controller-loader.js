/**
 *
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new ControllerLoader();
/** Modules **/
function ControllerLoader() {
    this.controllers = [];
    // Load a controller into container
    this.load = function (name, controller) {
        this.controllers[name] = controller;
    };
    /**
     * Load all controllers from the config file
     * @param String[] controllerPaths
     */
    this.loadConfigFile = function (controllerPaths) {
        var self = this;
        controllerPaths.forEach(function (controllerPath) {
            var Controller = require(controllerPath);
            self.load(Controller.prototype.constructor.name, new Controller());
        });
    };
    // Get a method of registed controller with method name - format: controller@method
    this.getControllerMethod = function (methodName) {
        var retval = null;
        var controllerNMethod = methodName.split("@");
        if (controllerNMethod.length == 2) {
            if (this.controllers.hasOwnProperty(controllerNMethod[0])) {
                retval = this.controllers[controllerNMethod[0]][controllerNMethod[1]];
            }
        }
        return retval;
    };
}