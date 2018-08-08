module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    $route.get("/", "HomeController@welcome");
    /** Register socket.io requests **/
    /** Register filters **/
};