var models = require('../models');
var exec = require('child_process').exec;

module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('request', function (data) {


            // CURTAIN ---------------------------------------------
            if(data.command.indexOf('gordijn') > -1) {
                if (data.command == 'gordijn open') {
                    if (!curtainInUse) {
                        if (!curtainOpen) {
                            // Code that is executed after timer
                            setTimeout(function () {
                                curtainInUse = false;
                                curtainOpen = true;
                                socket.emit('message', {
                                    message: 'Curtain is now open!'
                                });
                            }, 38 * 1000);
                            //code that will be executed immediately
                            curtainInUse = true;
                            exec('sudo python scripts/omhoog.py', function (error, stdout, stderr) {
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
                            socket.emit('message', {
                                message: 'Curtain is being opened!'
                            });
                            // curtainOpen Check
                        } else {
                            socket.emit('message', {
                                message: 'Curtain is already open!'
                            });
                        }
                        // Curtain in use check
                    } else {
                        socket.emit('message', {
                            message: 'Curtain is already in use!'
                        });
                    }
                } else {

                }

                if (data.command == 'gordijn dicht') {
                    if (!curtainInUse) {
                        if (curtainOpen) {
                            // Code that is executed after timer
                            setTimeout(function () {
                                curtainInUse = false;
                                curtainOpen = false;
                                socket.emit('message', {
                                    message: 'Curtain has been closed!'
                                });
                            }, 38 * 1000);
                            //code that will be executed immediately
                            curtainInUse = true;
                            exec('sudo python scripts/omlaag.py', function (error, stdout, stderr) {
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
                            socket.emit('message', {
                                message: 'Curtain is being closed'
                            });
                            // curtainOpen Check
                        } else {
                            socket.emit('message', {
                                message: 'Curtain has been closed!'
                            });
                        }
                        // Curtain in use check
                    } else {
                        socket.emit('message', {
                            message: 'Curtain is already in use!'
                        });
                    }
                }
            } else {
                models.Command.find({
                    where: {text: data.command},
                    include: [models.Task]
                }).then(function (command) {
                    var timeTrack = 0;

                    var tasks = command.Tasks;

                    tasks.forEach(function (task) {
                        setTimeout(function () {
                            executeCommand(task);
                        }, timeTrack += 1250);
                    });
                    socket.emit('message', {
                        message: command.response
                    });
                }).catch(function(err){
                    console.log(err);
                    socket.emit('message', {
                        message: "commando: " + data.command + " is niet bekend"
                    });
                });
            }
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