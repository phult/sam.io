/**
 * @author Phuluong
 * Jan 11, 2016
 */
module.exports = new SessionManager();
var pathConfig = require(__dir + "/config/paths");
var util = require("../../core/util");
var sessions = {};
var driver = null;
function SessionManager() {
    this.SESSION_ID_KEY = "adu_session_id";
    this.timeout = -1;
    this.interval = 60000;
    this.start = function (config) {
        var self = this;
        this.timeout = config.timeout * 60 * 1000;
        driver = new (require(__dir + pathConfig["sessionDrivers"] + "/" + config.driver))(config);
        sessions = driver.getSessions();
        setInterval(function () {
            self.destroyExpiredSessions();
        }, this.interval);
    };
    this.initHTTPSession = function (request, response) {
        var retval = {
            type: "http"
        };
        // get cookies
        var cookies = {};
        if (request.headers != null && request.headers.cookie != null) {
            request.headers.cookie.split(";").forEach(function (cookie) {
                var parts = cookie.split("=");
                cookies[parts[0].trim()] = (parts[1] || "").trim();
            });
        }
        // existed session
        if (cookies[this.SESSION_ID_KEY] != null && sessions[cookies[this.SESSION_ID_KEY]] != null) {
            retval = sessions[cookies[this.SESSION_ID_KEY]];
            if (retval != null) {
                retval.cookies = cookies;
            }
        }
        // init new session
        else {
            var sessionId = util.randomString();
            retval.id = sessionId;
            retval.cookies = cookies;
            var self = this;
            // add to sessions
            sessions[sessionId] = retval;
            // set cookie value
            response.writeHead = function (statusCode) {
                var reasonPhrase = "", headers = {};
                if (2 == arguments.length) {
                    if ("string" == typeof arguments[1]) {
                        reasonPhrase = arguments[1];
                    } else {
                        headers = arguments[1];
                    }
                } else if (3 == arguments.length) {
                    reasonPhrase = arguments[1];
                    headers = arguments[2];
                }
                headers["Set-Cookie"] = self.SESSION_ID_KEY + "=" + sessionId;
                writeHead.apply(response, [statusCode, reasonPhrase, headers]);
            };
        }
        retval.lastActive = Date.now();
        retval.get = function (key, value, defaultValue) {
            return driver.get(retval.id, key, value, defaultValue);
        };
        retval.set = function (key, value) {
            return driver.set(retval.id, key, value);
        };
        retval.set("_type_", retval.type);
        retval.set("_lastActive_", retval.lastActive);
        return retval;
    };
    this.initSocketIOSession = function (socket) {
        var retval = {
            type: "socketIO"
        };
        var userId = socket.handshake.query.userId;
        retval.id = socket.id;
        retval.userId = userId;
        retval.socket = socket;
        retval.lastActive = Date.now();
        if (socket.handshake.query.extra != null) {
            var params = socket.handshake.query.extra.split(",");
            params.forEach(function (param) {
                retval[param] = socket.handshake.query[param];
            });
        }
        retval.get = function (key, value, defaultValue) {
            return driver.get(retval.id, key, value, defaultValue);
        };
        retval.set = function (key, value) {
            return driver.set(retval.id, key, value);
        };
        retval.set("_type_", retval.type);
        retval.set("_lastActive_", retval.lastActive);
        // add to sessions
        sessions[socket.id] = retval;
        return retval;
    };
    this.destroy = function (session) {
        var retval = false;
        if (session != null && session.id != null) {
            delete sessions[session.id];
            driver.destroy(session.id);
            retval = true;
        }
        return retval;
    };
    /**
     * Get all socketio users
     * @returns {Array}
     */
    this.getUsers = function () {
        var retval = [];
        for (var i = 0; i < sessions.length; i++) {
            if (sessions[i].userId == null) {
                continue;
            }
            var existedUser = false;
            for (var j = 0; j < retval.length; j++) {
                if (retval[j].userId == null) {
                    continue;
                }
                if (retval[j].userId == sessions[i].userId) {
                    existedUser = true;
                    break;
                }
            }
            if (!existedUser) {
                retval.push(sessions[i]);
            }
        }
        return retval;
    };
    /**
     * Get session by userId
     * @param {int|String} userId
     * @returns {Array}
     */
    this.getUserSessions = function (userId) {
        var reval = [];
        for (var i = 0; i < sessions.length; i++) {
            if (sessions[i].userId == userId) {
                reval.push(sessions[i]);
            }
        }
        return reval;
    };
    /**
     * Get sessions by type
     * @returns {Array}
     */
    this.getSessions = function (type) {
        var retval = [];
        switch (type) {
            case "http":
            {
                for (var sessionId in sessions) {
                    if (sessions[sessionId].type == "http") {
                        retval.push(sessions[sessionId]);
                    }
                }
                break;
            }
            case "socketIO":
            {
                for (var sessionId in sessions) {
                    if (sessions[sessionId].type == "socketIO") {
                        retval.push(sessions[sessionId]);
                    }
                }
                break;
            }
            default :
            {
                for (var sessionId in sessions) {
                    retval.push(sessions[sessionId]);
                }
                retval = sessions;
            }
        }
        return retval;
    };
    /**
     * Get session by io socket
     * @returns {Session}
     */
    this.getSessionBySocket = function (socket) {
        var retval = null;
        for (var sessionId in sessions) {
            if (sessions[sessionId].socket == socket) {
                retval = sessions[sessionId];
                break;
            }
        }
        return retval;
    };
    /**
     * Find expired sessions and destroy them
     */
    this.destroyExpiredSessions = function () {
        var httpSessions = this.getSessions("http");
        for (var i = 0; i < httpSessions.length; i++) {
            var session = httpSessions[i];
            if ((Date.now() - session.lastActive) > this.timeout) {
                this.destroy(session);
            }
        }
    };
}