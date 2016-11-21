var express = require('express');
var session = require('express-session');
var dateFormat = require('dateformat');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var state = require('./state');

var app = express();
app.use(bodyParser.json());
var responsePath = '';

//Detect if run on Heroku based on a config var set on the heroku app
var sess = {
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {}
};

app.use(session(sess));

app.use(express.static('./public'));


// FOR CORDOVA FILES - COPY FROM PHONEGAP/PLATFORMS/WWW WHEN ADDING NEW PLUGINS
app.use(express.static('./api-mock-server/cordova'));

var port = normalizePort(process.env.PORT || '1508');

app.listen(port, function() {
    console.log('Node app is running on port', port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = app;
