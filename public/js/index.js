var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');


});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

var email = {
  from: 'jonny@example.com',
  text: 'Hello server, how are you?'
}

socket.emit('createMessage', email);

socket.on('welcomeMessage', function (message) {
  console.log('welcome message', message);
});

socket.on('userJoined', function (message) {
  console.log(message);
});
