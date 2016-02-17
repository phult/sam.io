/** Exports */
module.exports = EJS;
/** Imports **/
var ejs = require("ejs");
var fs = require("fs");
var Engine = require(__dir + "/core/io/view/engine");
/** Modules **/
function EJS(config) {
    this.render = function (view, data, options) {
        options.filename = config.view + "/" + view + ".ejs";
        return ejs.render(readView(view), data, {
            filename: config.view + "/" + view + ".ejs"
        });
    };
    function readView(view) {
        return fs.readFileSync(config.view + "/" + view + ".ejs").toString();
    }
}
EJS.prototype = new Engine();