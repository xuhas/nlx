var app = require('http').createServer()
var io = require('socket.io')(app);

exports.default = function () {
    app.listen(3000);
    console.log("Socket listening on port 3000")
    
    io.on('connection', function (socket) {
        socket.on('transfer', function (data) {
          console.log(data);
          socket.emit('hands-events', { data });
        });
    });
}