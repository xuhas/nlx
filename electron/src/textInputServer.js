// var app = require('http').createServer()
// var io = require('socket.io');
let io = require("socket.io-client");
let {GetTextInput} = require('./textToDirections.js')




exports.default = function () {
  console.log("Text Input Server started");
  const socket = io('http://localhost:3001');

  socket.on('connect', function() {
    console.log("Socket Connected");
  });
  GetTextInput(socket)
}