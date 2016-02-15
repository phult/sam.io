module.exports = function ($event, $logger) {
    $event.listen("home.*", function (event, params) {
        $logger.debug("ON EVENT '" + event + "'", params);
    });
};