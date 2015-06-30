var models = require('../models');
var exec = require('child_process').exec;

module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('request', function (data) {
            console.log('======================== DIT KWAM ER BINNEN ========================')
            console.log(data);
            socket.emit('message', {
                message: data.command
            });
            models.Command.findAll(
            ).then(function (commands) {
                    commands.some(function (command) {
                        //console.log(index + ": " + value);
                        console.log(command.text)
                        return checkIfCommandMatches(command, data.command);
                    });
                });
        });
    });

}

function checkIfCommandMatches(command, dbCommand) {
    if (command.text == dbCommand) {
        executeCommand(command);
        return true;
    }
}

function executeCommand(command) {
    models.Task.findOne({
        where: {id: command.TaskId}
    }).then(function (task) {
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
    });
}