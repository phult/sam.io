var util = require(__dir + "/core/util");
module.exports = function (route) {

    /** Register HTTP requests **/
    route.get("/", function (io) {
        io.make("hello world");
    });
    route.get("/home", "HomeController@index");
    route.post("/login", "User/AuthController@login");
    route.get("/download", "HomeController@download",
            {
                before: ["auth", function (io) {
                        util.log("processing a download request");
                    }],
                after: function (io) {
                    util.log("finished a download request");
                }
            }
    );

    /** Register socket.io requests **/
    route.io("broadcast", "HomeController@broadcast");

    /** Register filters **/
    route.filter("auth", function (io) {
        if (io.session.get("user") == null) {
            io.status(401).json({
                status: 401,
                result: "unauthorized"
            });
            return false;
        }
    });
};