/**
 *
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new ControllerLoader();
/** Imports **/
var util = require("../util");
/** Modules **/
function ControllerLoader() {
    this.controllers = [];
    // Load a controller into container
    this.load = function (name, controller) {
        this.controllers[name] = controller;
    };
    /**
     * Load controllers from the config file which contains controller list
     * @param {} controllers
     */
    this.loadConfiguration = function (controllers) {
        var self = this;
        if (controllers != null) {
            for (var controllerName in controllers) {
                var Controller = require(controllers[controllerName]);
                self.load(controllerName, new Controller());
            }
        }
    };
    /**
     * Load all controllers from a directory
     * @param String[] controllerPaths
     */
    this.loadDirectory = function (directory) {
        var self = this;
        var controllerFiles = util.browseFiles(directory);
        controllerFiles.forEach(function (controllerFile) {
            var Controller = require(controllerFile);
            var controller = new Controller();
            var controllerName = (controller.namespace != null ? controller.namespace + "/" : "") + Controller.prototype.constructor.name;
            self.load(controllerName, controller);
        });
    };
    // Get a method of registed controller with method name - format: controller@method
    this.getAction = function (methodName) {
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