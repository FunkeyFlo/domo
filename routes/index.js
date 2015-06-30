var models = require('../models');
//var bcrypt = require('bcrypt-nodejs');

module.exports = function (app, passport) {

    var passportService = require('../passport/passportService')(passport);

    // INDEX PAGE
    app.get('/', isLoggedIn, function (req, res) {
        models.Task.findAll({
            include: [models.Command]
        }).then(function (tasks) {
            res.render('index', {
                title: 'Express',
                tasks: tasks,
                loggedInUser: req.user
            });
        });
    });

    app.post('/create', isLoggedIn, function (req, res) {
        models.Task.create({
            title: req.param('title'),
            cmd: req.param('cmd')
        }).then(function () {
            res.redirect('/');
        });
    });

    app.get('/:task_id/destroy', isLoggedIn, function (req, res) {
        models.Task.find({
            where: {id: req.param('task_id')},
            include: [models.Command]
        }).then(function (task) {
            models.Command.destroy(
                {where: {TaskId: task.id}}
            ).then(function (affectedRows) {
                    task.destroy().then(function () {
                        res.redirect('/');
                    });
                });
        });
    });

    app.post('/:task_id/commands/create', isLoggedIn, function (req, res) {
        models.Task.find({
            where: {id: req.param('task_id')}
        }).then(function (task) {
            models.Command.create({
                text: req.param('text'),
                response: req.param('response')
            }).then(function (title) {
                title.setTask(task).then(function () {
                    res.redirect('/');
                });
            });
        });
    });

    app.get('/:task_id/commands/:command_id/destroy', isLoggedIn, function (req, res) {
        models.Task.find({
            where: {id: req.param('task_id')}
        }).then(function (task) {
            models.Command.find({
                where: {id: req.param('command_id')}
            }).then(function (command) {
                command.setTask(null).then(function () {
                    command.destroy().then(function () {
                        res.redirect('/');
                    });
                });
            });
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', {message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/login',
        passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
        function (req, res) {
            res.redirect('/');
        });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}