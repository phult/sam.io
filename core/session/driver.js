/**
 * @author Phuluong
 * Jan 11, 2016
 */
/** Exports **/
module.exports = Driver;
/** Modules **/
function Driver(config) {
    this.get = function (sessionId, key, defaultValue) {
        throw new Error("function is not implemented");
    };
    this.set = function (sessionId, key, value) {
        throw new Error("function is not implemented");
    };
    this.remove = function (sessionId, key) {
        throw new Error("function is not implemented");
    };
    this.pull = function (sessionId, key, defaultvalue) {
        throw new Error("function is not implemented");
    };
    this.getSessions = function () {
        throw new Error("function is not implemented");
    };
    this.destroy = function (sessionId) {
        throw new Error("function is not implemented");
    };
}

