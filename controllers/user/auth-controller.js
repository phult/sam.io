module.exports = AuthController;
function AuthController() {
    this.namespace = "User";
    this.login = function (io) {        
        io = io.status(200);
        var respondData = {};
        // get session data
        var user = io.session.get("user", null);
        // user logged in
        if (user != null) {
            // redirect to index action
            io.redirect("/home");
        } else {
            // process login
            // ...
            // set session data
            io.session.set("user", io.inputs);
            // build response data
            respondData.status = "successful";
            respondData.result = "login";
        }
        // respond
        io.json(respondData);
    };
    this.logout = function (io) {
        io.session.remove("user");
        io.json({
            status: "successful",
            result: "logout"
        });
    };    
}