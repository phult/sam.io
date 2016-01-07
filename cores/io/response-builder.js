/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = ResponseBuilder;
/** Modules **/
function ResponseBuilder() {
    this.p = {
        type: "http",
        status: 200,
        headers: {},
        isToAll: false,
        toEvent: null,
        tos: [],
        toExpections: [],
        toCriterias: [],
        toExpectionCriterias: []
    };
    this.type = function (type) {
        this.p.type = type;
        return this;
    };
    this.status = function (status) {
        this.p.status = status;
        return this;
    };
    this.header = function (name, value) {
        this.p.headers[name] = value;
        return this;
    };
    this.toEvent = function (event) {
        this.p.toEvent = event;
        return this;
    };
    this.to = function (session) {
        if (session != null) {
            this.p.tos.push(session);
            this.p.tos = this.p.tos.unique();
        }
        return this;
    };
    this.toAll = function () {
        this.p.isToAll = true;
        return this;
    };
    this.toExpection = function (session) {
        if (session != null) {
            this.p.toExpections.push(session);
        }
        return this;
    };
    this.toCriteria = function (property, value) {
        this.p.toCriterias[property] = value;
        return this;
    };
    this.toExpectionCriteria = function (property, value) {
        this.p.toExpectionCriterias[property] = value;
        return this;
    };
    this.build = function () {
        this.buildHttp();
        this.buildReceiver();
    };
    this.buildHttp = function () {
        if (this.response != null) {
            this.response.writeHead(this.p.status, this.p.headers);
        }
    };
    this.buildReceiver = function () {
        // build emit event
        this.p.toEvent = (this.p.toEvent === null ? this.routeName : this.p.toEvent);
        // build received io sessions
        if (this.p.isToAll) {
            this.p.tos = this.ioConnection.sessions;
        } else {
            for (var property in this.p.toCriterias) {
                this.ioConnection.sessions.forEach(function (session) {
                    if (session[property] == this.p.toCriterias[property]) {
                        this.p.tos.push(session);
                    }
                });
            }
        }
        for (var property in this.p.toExpectionCriterias) {
            for (var i = 0; i < this.p.tos.length; ++i) {
                if (this.p.toExpectionCriterias[property] == this.p.tos[i][property]) {
                    this.p.tos.splice(i, 1);
                }
            }
        }
        this.p.tos.remove(this.p.toExpections);
    }
}