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

socket.on('newMessage', function(message) {
  console.log('New message', message);
});
