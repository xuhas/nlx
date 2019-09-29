var apps = require('http').createServer()
var io = require('socket.io')(apps);
let { GetTextInput } = require('./textToDirections.js');
let express = require('express');
let app = express();
let currentTextCommand;

exports.default = function () {
    apps.listen(3001)
    app.listen(3003);

    console.log("Text Input Server started");
    console.log("Socket listening on port 3001")

    io.on('connection', function (socket) {
        console.log("Socket Connected");
        socket.on('transfer', function (data) {
            console.log("socketRecieve");
            currentTextCommand = data;
        });
    });

    app.get('/textInput', (req, res) => {
        console.log('THERE IS A GET');
        if (!currentTextCommand) return res.sendStatus(500);
        return res.send(currentTextCommand);
    });

    GetTextInput()
}