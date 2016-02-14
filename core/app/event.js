/**
 * @author Phuluong
 * Feb 12, 2016
 */

/** Exports **/
module.exports = new Event();
/** Imports **/
var autoLoader = require(__dir + "/core/loader/auto-loader");
/** Modules **/
function Event() {
    var listenerContainer = {};
    /**
     * Subscribe a event
     * @param {String} event
     * @param {String|function} listener
     */
    this.listen = function (event, listener) {
        if (listenerContainer[event] == null) {
            listenerContainer[event] = [];
        }
        listenerContainer[event].push(listener);
    };
    /**
     * Publish a event
     * @param {String} event
     * @param {object} params
     */
    this.fire = function (event, params) {
        var listeners = listenerContainer[event];
        if (listeners != null && listeners.length > 0) {
            listeners.forEach(function (listener) {
                if (typeof listener === "string") {
                    listener = autoLoader.getAction(listener);
                }
                if (listener != null) {
                    // Call the listener
                    var result = listener(event, params);
                    // Stop the propagation of the event if the listener returns false result
                    if (!result) {
                        return;
                    }
                }
            });
        }
    };
}

