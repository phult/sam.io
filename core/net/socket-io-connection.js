/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new SocketIOConnection();
/** Imports **/
/** Classes **/
function SocketIOConnection() {
    this.messageListeners = [];
    this.connectionListeners = [];
    this.io = require("socket.io");
    /**
     * Add A messsage listener
     * @param {interface[onClientMessage]} listener
     * @returns {bool}
     */
    this.addMessageListener = function (namespace, listener) {
        this.messageListeners[namespace] = listener;
    };
    /**
     * Add A messsage listener
     * @param {interface[onConnectionEvent]} listener
     * @returns {bool}
     */
    this.addConnectionListener = function (listener) {
        this.connectionListeners.push(listener);
    };
    this.onConnectionEvent = function (type, data) {
        for (var i = 0; i < this.connectionListeners.length; i++) {
            try {
                this.connectionListeners[i](type, data);
            } catch (exc) {

            }
        }
    };
    this.sendMessage = function (toUserId, type, message, ignoredClientSession) {
        var users = this.sessionManager.getUserSessions(toUserId);
        for (var i = 0; i < users.length; i++) {
            if (ignoredClientSession != null && users[i].socket === ignoredClientSession.socket) {
                continue;
            }
            users[i].socket.emit(type, message);
        }
    };
    this.sendMessageToSession = function (session, type, message) {
        session.socket.emit(type, message);
    };
    this.broadcastMessage = function (type, message) {
        var users = this.sessionManager.getSocketIOSessions();
        for (var i = 0; i < users.length; i++) {
            users[i].socket.emit(type, message);
        }
    };
    this.bindSocketMessageToListeners = function (socket, session) {
        var self = this;
        for (var namespace in self.messageListeners) {
            if (self.messageListeners[namespace] != null) {
                socket.on(namespace, function (data) {
                    self.messageListeners[namespace](data, session);
                });
            }
        }
    };
    this.listen = function (httpServer, sessionManager) {
        var self = this;
        this.sessionManager = sessionManager;
        socketIO = self.io(httpServer.getServer());
        socketIO.sockets.on("connection", function (socket) {
            // Initialize session
            var session = self.sessionManager.initSocketIOSession(socket);
            console.log("connections----------", self.sessionManager.getSessions("socketIO").length);
            self.sessionManager.getSessions("socketIO").forEach(function (session) {
                console.log("session.id", session.id);
            });
            // Fire connection event
            self.onConnectionEvent("connection", session);
            // Receive a message from the client
            self.bindSocketMessageToListeners(socket, session);
            socket.on("disconnect", function () {
                // Remove from sessions
                var session = self.sessionManager.getSessionBySocket(socket);
                self.sessionManager.destroy(session);
                self.onConnectionEvent("disconnect", session);
            });
        });
    };
}