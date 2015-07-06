var models = require('../models');
var checkForCommandMatch = require('./../functionality/expressionMatcher');
var executeCommand = require('./../functionality/cmdExecutor');

module.exports = function (io) {

    io.on('connection', function (socket) {

        // KAKU Configurer
        socket.on('kaku', function (data) {
            console.log('received: ' + data);
            executeCommand(data);
        });

        // Command execution requests
        socket.on('request', function (data) {
            var commandFound = false
            console.log('RECEIVED COMMAND: ' + data.command.toLowerCase() + ' =======================');
            models.Command.findAll({
                include: [models.Task]
            }).then(function (commands) {

                commands.some(function (command) {
                    var input = data.command.trim().concat(' ').toLowerCase();

                    if (checkForCommandMatch(input, 0, command.expression, 0)) {
                        var tasks = command.Tasks;
                        commandFound = true;
                        var timeTrack;

                        tasks.forEach(function (task) {
                            setTimeout(function () {
                                executeCommand(task.cmd);
                            }, timeTrack += 1250);
                        });

                        socket.emit('message', {
                            message: command.response
                        });

                        return true;
                    }
                });

                if (!commandFound) {
                    socket.emit('message', {
                        message: "opdracht: " + data.command + " is niet bekend"
                    });
                }
            });
        });
    });
}