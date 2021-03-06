var models = require('../models');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (app, passport) {

    var passportService = require('../passport/passportService')(passport);

    // INDEX PAGE
    app.get('/', isLoggedIn, function (req, res) {
        res.render('index', {
            title: 'Dashboard',
            loggedInUser: req.user
        });
    });

    app.get('/interpreter', isLoggedIn, function (req, res) {
        res.render('interpreter', {
            title: 'Interpreter',
            loggedInUser: req.user
        });
    });

    app.get('/kaku-configurer', isLoggedIn, function (req, res) {
        res.render('kakuConfigurer', {
            title: 'Klik aan klik uit kanaal instellen',
            loggedInUser: req.user
        });
    });

    app.get('/command-centre', isLoggedIn, function (req, res) {
        var start;
        var steps = 6;

        console.log('param : ' + req.param('page'));
        if (typeof req.param('page') === "undefined") {
            start = 0;
        } else {
            start = 6 * (req.param('page')-1);
        }
        console.log('start : ' + start);
        console.log('end   : ' + steps);
        models.Command.findAndCountAll().then(function (result) {
            models.Command.findAll({
                offset: start,
                limit: steps,
                include: [models.Task]
            }).then(function (commands) {
                res.render('commandcentre', {
                    title: 'Command-Centre',
                    commandTotal: Math.ceil(result.count / 6),
                    commands: commands,
                    loggedInUser: req.user
                });
            });
        });
    }); 

    app.post('/create', isLoggedIn, function (req, res) {
        console.log(req.param('title'));
        console.log(req.param('response'));
        models.Command.create({
            // Cast all characters to lower string to ensure command search accuracy
            title: req.param('title').toLowerCase(),
            expression: req.param('expression'),
            response: req.param('response')
        }).then(function () {
            res.redirect('/command-centre');
        });
    });

    app.get('/:command_id/destroy', isLoggedIn, function (req, res) {
        models.Command.find({
            where: {id: req.param('command_id')},
            include: [models.Task]
        }).then(function (command) {
            models.Task.destroy(
                {where: {CommandId: command.id}}
            ).then(function (affectedRows) {
                    command.destroy().then(function () {
                        res.redirect('/command-centre');
                    });
                });
        });
    });

    app.post('/:command_id/tasks/create', isLoggedIn, function (req, res) {
        models.Command.find({
            where: {id: req.param('command_id')}
        }).then(function (command) {
            models.Task.create({
                title: req.param('title'),
                cmd: req.param('cmd')
            }).then(function (title) {
                title.setCommand(command).then(function () {
                    res.redirect('/command-centre');
                });
            });
        });
    });

    app.get('/:command_id/tasks/:task_id/destroy', isLoggedIn, function (req, res) {
        models.Command.find({
            where: {id: req.param('command_id')}
        }).then(function (command) {
            models.Task.find({
                where: {id: req.param('task_id')}
            }).then(function (task) {
                task.setCommand(null).then(function () {
                    task.destroy().then(function () {
                        res.redirect('/command-centre');
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
        res.render('login', {
            message: req.flash('loginMessage'),
            title: 'Domo Login'
        });
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

    // FOR TESTING PURPOSES ============================================================
    app.get('/destroy-database', function (req, res) {
        models.sequelize.sync({force: true});
    });

    app.get('/create-admin', function (req, res) {
        models.User.create({
            username: 'admin',
            password: bcrypt.hashSync('admin', bcrypt.genSaltSync(8), null)
            //password: 'admin'
        });
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