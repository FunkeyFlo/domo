var models = require('../models');
var exec = require('child_process').exec;

module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('request', function (data) {
            console.log('======================== DIT KWAM ER BINNEN ========================')
            console.log(data);
            models.Command.find({
                where: {text: data.command},
                include: [models.Task]
            }).then(function (command) {

                var timeTrack = 0;

                console.log(command + '==============================');
                console.log(command.Tasks + '==============================');

                var tasks = command.Tasks;

                tasks.forEach(function (task) {
                    setTimeout(function () {
                        executeCommand(task);
                    }, timeTrack += 1250);
                });
                socket.emit('message', {
                    message: command.response
                });
            });
        });
    });
}

function executeCommand(task) {
    exec(task.cmd, function (error, stdout, stderr) {
        if (stdout !== null) {
            console.log('stdout: ' + stdout);
        }

        if (stderr !== null) {
            console.log('stderr: ' + stderr);
        }

        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}