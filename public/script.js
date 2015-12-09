var socket = io()
var username = window.prompt('Enter your username')

if (!username) {
  var ran = Math.floor((Math.random() * 999) + 100)
  username = 'user' + ran
}

function addMessage(message) {
  var messages = document.getElementById('messages')
  var li = document.createElement('li')

  var timestamp = new Date(message.timestamp)
  var time = timestamp.toLocaleTimeString()
  li.textContent = `${message.username} at ${time}: ${message.message}`
  messages.appendChild(li)
}

$('form').submit(function () {
  var timestamp = new Date()
  var msg = {
    username: username,
    msg: $('#msg').val(),
    timestamp: timestamp.toISOString()
  }
  socket.emit('chat message', msg);
  $('#msg').val('');
  return false;
});

socket.on('chat message', addMessage)

socket.on('chat log', function (messages) {
  messages.forEach(addMessage)
})
