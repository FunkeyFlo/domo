var socket = io();

var speech = function (message) {
    if ('speechSynthesis' in window) {
        var msg = new SpeechSynthesisUtterance();
        var voices = speechSynthesis.getVoices();
        msg.lang = 'nl-NL';
        msg.voice = voices[0];
        msg.rate = 1; // 0.1 to 10
        msg.text = message;
        speechSynthesis.speak(msg);
    } else {
        alert(message);
    }
}

if (annyang) {

    var goodbye = function () {
        speech('tot ziens!')
        window.open('/signout', "_self");
    }

    var hello = function () {
        speech('Hallo!');
    }

    var helloName = function (name) {
        speech('Hallo! ik ben ' + name + '!');
    }

    var helloPerson = function (name) {
        speech('Hallo ' + name + ', hoe maakt u het?');
    }

    var kaas = function () {
        speech('Panda!');
    }

    var allLights = function(status) {
        socket.emit('request', {command: 'alle ' + status});
    }

    var tv = function (param) {
        socket.emit('request', {command: 'tv ' + param});
    }

    var light = function (status) {
        socket.emit('request', {command: 'nachtlamp ' + status});
    }

    var deskLight = function (status) {
        socket.emit('request', {command: 'bureaulamp ' + status});
    }

    var bedLight = function (status) {
        socket.emit('request', {command: 'bedlamp ' + status});
    }

    var radio = function (status) {
        socket.emit('request', {command: 'radio ' + status});
    }

    var vent = function (status) {
        socket.emit('request', {command: 'ventilator ' + status});
    }

    var cookWater = function () {
        socket.emit('request', {command: 'kook water'});
    }

    var ps4 = function () {
        socket.emit('request', {command: 'playstation'});
    }

    var curtain = function (status) {
        socket.emit('request', {command: 'gordijn ' + status});
    }

    // Let's define our first command. First the text we expect, and then the function it should call
    var commands = {

        'Tot ziens': goodbye,
        'Doei': goodbye,

        'Hallo': hello,
        'Hoi': hello,
        'Goedendag': hello,

        'tv *param': tv,

        // Met naam
        'Hallo *name': helloName,
        'Hoi *name': helloName,

        'Goedendag *name': helloName,

        // devices
        'nachtlamp *status': light,

        'bedlamp *status': bedLight,
        'bed lamp *status': bedLight,

        'bureaulamp *status': deskLight,

        'alle *status': allLights,

        'kook water': cookWater,
        'water koken': cookWater,

        'ventilator *status': vent,

        'playstation': ps4,
//            'radio *status': radio,
//            'gordijn *status': curtain,

        'dankjewel': function() {
            speech('Graag gedaan!');
        },

        'bedankt': function() {
            speech('Geen probleem baas!');
        },

        'stommerd': function() {
            speech('Kijk naar jezelf, vieze tinder slet');
        },

        // test
        'panda': kaas,

        'Ik heet *name': helloPerson,
        'Ik ben *name': helloPerson
    };

    // Start Debug
    annyang.debug();

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
}