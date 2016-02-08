module.exports = AuthController;
function AuthController() {
    this.namespace = "User";
    this.login = function (io) {
        io = io.status(200);
        var respondData = {};
        // get session data
        var user = io.session.get("user", null);
        // check if user logged in
        if (user != null) {
            // build response data
            respondData.status = "logged_in";
            respondData.result = user;
        } else {
            // process login
            // ...
            // set session data
            io.session.set("user", io.inputs);
            // build response data
            respondData.status = "login_successfully";
            respondData.result = io.inputs;
        }
        // respond
        io.json(respondData);
    };
}