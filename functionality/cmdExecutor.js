var exec = require('child_process').exec;

module.exports = function () {

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
}