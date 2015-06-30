var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var models = require('../models');

module.exports = function (passport) {

    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // De-Serialize sessions
    passport.deserializeUser(function (id, done) {
        models.User.find(
            {where: {id: id}}
        ).then(function (user) {
                done(null, user);
            }).error(function (err) {
                done(err, null);
            });
    });

    // Use local strategy to create user account
    passport.use(new LocalStrategy(
        function (username, password, done) {
            models.User.find(
                {where: {username: username}}
            ).then(function (user) {
                    console.log(user);
                    if (!user) {
                        done(null, false, {message: 'Unknown user'});
                    } else if (!bcrypt.compareSync(password, user.password)) {
                        done(null, false, {message: 'Invalid password'});
                    } else {
                        done(null, user);
                    }
                }).error(function (err) {
                    done(err);
                });
        }
    ));
}