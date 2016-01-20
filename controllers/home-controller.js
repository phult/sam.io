module.exports = HomeController;
function HomeController() {
    this.index = function (response) {
        // set session data
        response.session.set("message", "hello world");
        // get session data
        var responseData = response.session.get("message", "defaultValue");
        // respond
        response.status(200)
                .header("Content-Length", responseData.length)
                .make(responseData);
    };
    this.login = function (response) {
        response = response.status(200);
        var respondData = {};
        // get session data
        var user = response.session.get("user", null);
        // check if user logged in
        if (user != null) {
            // build response data
            respondData.status = "logged-in";
            respondData.result = user;
        } else {
            // process logging in bussiness
            // ...
            // set session data
            response.session.set("user", response.inputs);
            // build response data
            respondData.status = "login-successfully";
            respondData.result = response.inputs;
        }
        // respond
        response.json(respondData);
    };
    this.broadcast = function (response) {
        var responseData = {
            status: "successful",
            result: []
        };
        // respond to other sessions
        response.toEvent("message").toAll().toExpection(response.session).json(responseData);
    };
    this.download = function (response) {
        // respond
        response.status(200)
                .header("Content-Type", "image/png")
                .download(__base + "/assets/images/logo.png");
    };
}