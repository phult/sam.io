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
                .download(__dir + "/assets/images/logo.png");
    };
}