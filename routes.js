module.exports = function (route) {
    /** HTTP request **/
    route.get("/download", "HomeController@download");
    route.post("/login", "HomeController@login");
    route.get("/", "HomeController@index");
    /** Socket.io request **/
    route.io("broadcast", "HomeController@broadcast");
};