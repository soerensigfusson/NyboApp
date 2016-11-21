var state = {
    sessions: {},
    isLoggedIn: function(req) {
        return state.sessions.hasOwnProperty(req.session.id);
    }
}


module.exports = state;
