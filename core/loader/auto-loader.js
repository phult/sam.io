/**
 *
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new autoLoader();
/** Imports **/
var util = require("../util");
/** Modules **/
function autoLoader() {
    this.classMap = [];
    /**
     * Load a class into container
     * @param {String} name
     * @param {object} obj
     */
    this.load = function (name, obj) {
        if (this.classMap[name] != null) {
            throw new Error("auto-loader loaded a dupilcated class: " + name);
        } else {
            this.classMap[name] = obj;
        }
    };
    /**
     * Load class-paths from the config file which contains autoload paths
     * @param {Array} autoloadConfig
     */
    this.loadConfiguration = function (autoloadConfig) {
        var self = this;
        if (autoloadConfig != null) {
            autoloadConfig.forEach(function (directory) {
                self.loadDirectory(__dir + directory);
            });
        }
    };
    /**
     * Load all classes from a directory
     * @param String directory
     */
    this.loadDirectory = function (directory) {
        var self = this;
        var classPaths = util.browseFiles(directory);
        classPaths.forEach(function (classPath) {
            if (classPath.indexOf(".js") === (classPath.length - 3)) {
                var ClassFile = require(classPath);
                var obj = new ClassFile();
                var className = (obj.namespace != null ? obj.namespace + "/" : "") + ClassFile.prototype.constructor.name;
                self.load(className, obj);
            }
        });
    };
    // Get a registered action - format: class@method
    this.getAction = function (action) {
        var retval = null;
        var classNMethod = action.split("@");
        if (classNMethod.length == 2) {
            if (this.classMap.hasOwnProperty(classNMethod[0])) {
                retval = this.classMap[classNMethod[0]][classNMethod[1]];
            }
        }
        return retval;
    };
}