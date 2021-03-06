const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js')
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room) ) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room.toLowerCase());
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //emit event to one connection
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
    //emit event to other connections
    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined to chat'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    // socket.leave('The office fans');
    // io.emit -> io.to('The office fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The office fans').emit
    // socket.emit
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Create message', message);
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    //emit event to every single connection
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
      var user = users.getUser(socket.id);
      if (user) {
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
      }
  });


  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
    console.log('Disconnected from server');
  });
});

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
