module.exports = HomeController;
function HomeController() {
    this.index = function (io) {
        // get session data
        var user = io.session.get("user", null);
        // user logged in
        if (user != null) {
            var defaultValue = "first visit";
            // get session data
            var responseData = io.session.get("message", defaultValue);
            // set session data
            if (responseData === defaultValue) {
                io.session.set("message", "welcome back");
            }
            // respond
            io.status(200)
                    .header("Content-Length", responseData.length)
                    .make(responseData);
        }
        // redirect to login action
        else {
            io.delegate("User/AuthController@login");
        }
    };
    this.broadcast = function (io) {
        var responseData = {
            status: "successful",
            result: []
        };
        // respond to other sessions
        io.toEvent("message").toAll().toExpection(io.session).json(responseData);
    };
    this.download = function (io) {
        // respond
        io.status(200)
                .header("Content-Type", "image/png")
                .download(__dir + "/assets/images/logo.png");
    };
}