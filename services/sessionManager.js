// console.log(require("../index.js"))

var sizee = function() {
    // console.log(require("../index.js"))
    var sessionStore = require("../index.js").sessionStore;
    var LoggedUsers = sessionStore.sessions;
    // console.log(_.size(LoggedUsers), "\n\n", LoggedUsers, "EOF-SIZEE\n\n")
}

var createSession = function(data) {
    var sessionStore = require("../index.js").sessionStore
    var LoggedUsers = sessionStore.sessions
    var sessionID = data.sessionID
    LoggedUsers[sessionID] = data
}

var getAllSession = function(data) {
    var sessionStore = require("../index.js").sessionStore
    _.each(sessionStore.sessions, function(v, k) {
        v = JSON.parse(v);
        if (moment().isAfter(v["cookie"].expires)) {
            delete sessionStore.sessions[k];
        }
    });
    return sessionStore.sessions
}

var getSession = function(idd) {
    var sessionStore = require("../index.js").sessionStore
    return sessionStore.sessions[idd];
}

var changeSession = function(idd, newsession) {
    var sessionStore = require("../index.js").sessionStore
    sessionStore.set(idd, newsession, function(err, data) {});
}

var removeSession = function(sessionId) {
    console.log("logout>>>", sessionId);
    var sessionStore = require("../index.js").sessionStore
    _.each(sessionStore.sessions, function(v, k) {
        if (sessionId === k) {
            delete sessionStore.sessions[k];
        }
    });
    return sessionStore.sessions;
}

exports.sizee = sizee;
exports.createSession = createSession;
exports.getAllSession = getAllSession;
exports.changeSession = changeSession;
exports.getSession = getSession;
exports.removeSession = removeSession;
