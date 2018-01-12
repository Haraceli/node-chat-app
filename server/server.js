const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  //emit event to one connection
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
  //emit event to other connections
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined to chat'));

  socket.on('createMessage', (message, callback) => {
    console.log('Create message', message);
    //emit event to every single connection
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from the server');

    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // `https://google.com/maps?q=${coords.latitude},${coords.longitude}`


  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
