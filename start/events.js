module.exports = function ($event, $logger) {
    $event.listen("home.*", function (event, params) {
        $logger.debug("ON EVENT '" + event + "'", params);
    });
    $event.listen("connection.*", function (event, params) {
        $logger.debug("ON EVENT '" + event + "'", params);
    });
    $event.listen("system.*", function (event, params) {
        $logger.debug("ON EVENT '" + event + "'", params);
    });
};