var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

// SECURITY and MESSAGING
var passport = require('passport');
var flash = require('connect-flash');

// SESSIONS and COOKIES
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// DOMO Requirements
var SamsungRemote = require('samsung-remote');
var remote = new SamsungRemote({
    ip: '192.168.188.130' // required: IP address of your Samsung Smart TV
});

// DATABASE
var models = require("./models");

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'makemybabiesgrowbigandstrong'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//var debug = require('debug')('express-example');

app.set('port', process.env.PORT || 8080);

// {force: true}
models.sequelize.sync().then(function () {
    server.listen(app.get('port'), function () {
        var message = 'Server is running @ http://localhost:' + server.address().port;
        console.log(message);
    });
});

// ROUTES
require('./routes/index')(app, passport);
require('./socketing/requestHandler')(io);

module.exports = app;