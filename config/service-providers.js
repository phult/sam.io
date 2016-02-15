var config = require(__dir + "/core/app/config");
var routerLoader = require(__dir + "/core/loader/route-loader");
var event = require(__dir + "/core/app/event");
var logger = (require(__dir + "/core/log/logger-factory")).getLogger();
module.exports = function ($serviceProvider) {
    $serviceProvider.bind("$config", config);
    $serviceProvider.bind("$route", routerLoader);
    $serviceProvider.bind("$event", event);
    $serviceProvider.bind("$logger", logger);
};