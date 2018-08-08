/** Exports */
module.exports = EJS;
/** Imports **/
var ejs = require("ejs");
var fs = require("fs");
cache = require('lru-cache');
var Engine = require(__dir + "/core/io/view/engine");
/** Modules **/
function EJS(config) {
    ejs.cache = cache(100);
    this.render = function (view, data, options) {
        options.filename = config.view + "/" + view + "." + config.viewExtension;
        return ejs.render(readView(view), data, {
            filename: config.view + "/" + view + "." + config.viewExtension
        });
    };
    function readView(view) {
        return fs.readFileSync(config.view + "/" + view + "." + config.viewExtension).toString();
    }
}
EJS.prototype = new Engine();