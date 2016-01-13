module.exports = HomeController;
function HomeController() {
    this.index = function (response) {
        // set session
        response.session.set("message", "hello world");
        // get session
        var responseData = response.session.get("message", "defaultValue");
        // respond
        response.status(200).header("Content-Length", responseData.length).make(responseData);
    };
    this.login = function (response) {
    };
    this.broadcast = function (response) {
        var responseData = {
            status: "successful",
            result: []
        };
        response.toEvent("message").toAll().toExpection(response.session).json(responseData);
    };
}