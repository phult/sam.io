module.exports = AuthController;
function AuthController() {
    this.namespace = "User";
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
}