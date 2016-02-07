module.exports = function (route) {
    /** HTTP request **/
    route.get("/download", "HomeController@download",
            {
                before: function (response) {
                    if (response.session.get("user") == null) {
                        response.status(401).json({
                            status: 401,
                            result: "unauthorized"
                        });
                        return false;
                    }
                },
                after: function (response) {

                }
            }
    );
    route.post("/login", "User/AuthController@login");
    route.get("/", "HomeController@index");
    /** Socket.io request **/
    route.io("broadcast", "HomeController@broadcast");
};