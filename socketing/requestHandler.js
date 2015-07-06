var models = require('../models');
var exec = require('child_process').exec;

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

function checkForCommandMatch(input, currentInputIndex, expression, currentExpressionIndex) {

    var endOfInputWord = input.indexOf(' ', currentInputIndex);
    var inputWord = input.substring(currentInputIndex, endOfInputWord);
    //console.log('inputWord   :   ' + inputWord);

    // Baseline
    if (expression.length <= currentExpressionIndex) {
        return false;
    } else if (input.length <= currentInputIndex) {
        return false;
    }

    else {

        if (expression.charAt(currentExpressionIndex) == '<') {
            var endIndex = expression.indexOf('>', currentExpressionIndex);
            var possibles = expression.substring(currentExpressionIndex + 1, endIndex);
            //console.log('possibles   :   ' + possibles);

            if (compareToPossibles(inputWord, possibles)) {
                if (expression.length - 1 <= endIndex) {
                    return true;
                } else {
                    return checkForCommandMatch(input, endOfInputWord + 1, expression, endIndex + 1)
                }
            } else {
                return checkForCommandMatch(input, endOfInputWord + 1, expression, currentExpressionIndex)
            }
        }

        else {

            var endOfCommandWord = expression.indexOf(' ', currentExpressionIndex);
            var commandWord = expression.substring(currentExpressionIndex, endOfCommandWord);
            //console.log('commandWord :   ' + commandWord);

            if (commandWord == inputWord) {
                if (expression.length - 1 <= endOfCommandWord) {
                    return true;
                } else {
                    return checkForCommandMatch(input, endOfInputWord + 1, expression, endOfCommandWord + 1);
                }
            } else {
                return checkForCommandMatch(input, endOfInputWord + 1, expression, currentExpressionIndex);
            }
        }
    }
}

function compareToPossibles(inputWord, possibleExpressionString) {
    var hasBeenFound = false;

    var possibleExpressions = possibleExpressionString.split(" ");

    possibleExpressions.some(function (possibleExpression) {
        if (possibleExpression === inputWord) {
            hasBeenFound = true;
            return true;
        }
    });

    return hasBeenFound;
}