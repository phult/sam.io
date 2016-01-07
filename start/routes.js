module.exports = function (route) {
    /** HTTP request **/
    route.get("/", "HomeController@index");
    route.post("/login", "HomeController@login");
    /** Socket.io request **/
    route.io("broadcast", "HomeController@broadcast");
};