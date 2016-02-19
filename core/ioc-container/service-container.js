/**
 * @author Phuluong
 * December 27, 2015
 */
/** Exports **/
module.exports = new ServiceProvider();
/** Imports **/
var logger = (require(__dir + "/core/log/logger-factory")).getLogger("ServiceProvider");
/** Modules **/
function ServiceProvider() {
    var serviceContainer = {};
    this.bind = function (abstract, concrete) {
        if (serviceContainer[abstract] != null) {
            logger.warning("Binding a duplicated abstract: " + abstract, concrete);
        }
        serviceContainer[abstract] = concrete;
    };
    this.make = function (abstract) {
        var retval = null;
        var concrete = serviceContainer[abstract];
        if (concrete != null) {
            if (typeof concrete == "function") {
                retval = new concrete();
            } else if (typeof concrete == "object") {
                retval = concrete;
            }
        }
        return retval;
    };
}


