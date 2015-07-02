var models = require('../models');
var exec = require('child_process').exec;

var cookerInUse = false;
var curtainOpen = false;
var curtainInUse = false;

module.exports = function (io) {

    io.on('connection', function (socket) {

        // KAKU Configurer
        socket.on('kaku', function (data) {
            console.log('received: ' + data);
            executeCommand(data);
        });

        // Command execution requests
        socket.on('request', function (data) {
            console.log('RECEIVED COMMAND: ' + data.command + ' =======================');
            models.Command.find({
                // Cast all characters to lower string to ensure accuracy
                where: {text: data.command.toLowerCase()},
                include: [models.Task]
            }).then(function (command) {
                var timeTrack = 0;

                var tasks = command.Tasks;

                tasks.forEach(function (task) {
                    setTimeout(function () {
                        executeCommand(task.cmd);
                    }, timeTrack += 1250);
                });
                socket.emit('message', {
                    message: command.response
                });
            }).catch(function (err) {
                console.log(err);
                socket.emit('message', {
                    message: "commando: " + data.command + " is niet bekend"
                });
            });
        });
    });
}

function executeCommand(cmd) {
    exec(cmd, function (error, stdout, stderr) {
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