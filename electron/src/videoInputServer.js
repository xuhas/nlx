var apps = require('http').createServer()
var io = require('socket.io')(apps);
let express = require("express");
const app = express();
let currentHandPosition;

exports.default = function () {
    apps.listen(3000);
    app.listen(3002);

    console.log("Video Input Server started");
    console.log("Socket listening on port 3000")

    io.on('connection', function (socket) {
        console.log("Socket Connected");
        socket.on('transfer', function (data) {
            // console.log('recieve');
            // socket.emit('hands-event', { data });
            currentHandPosition = data;
        });
    });

    app.get('/videoInput', (req, res) => {
        if (!currentHandPosition) return res.sendStatus(500)
        return res.send(currentHandPosition);
    });
}
