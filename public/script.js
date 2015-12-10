var socket = io()
var username = window.prompt('Enter your username')

if (!username) {
  var ran = Math.floor((Math.random() * 999) + 100)
  username = 'user' + ran
}

function getElapsedTime (timestamp) {
  var diff = Date.now() - timestamp.getTime()
  var minutes = Math.round(diff / 60000)
  var time
  if (minutes === 0) {
    time = 'a moment ago'
  } else {
    time = minutes + 'min ago'
  }
  return time
}

function addMessageSegment (message) {
  var chat = document.querySelector('.chat')
  var section = document.createElement('section')
  // var pUser = document.createElement('p')
  // var pMsg = document.createElement('p')
  // var pTime = document.createElement('p')

  var timestamp = new Date(message.timestamp)
  var time = getElapsedTime(timestamp)

  section.innerHTML = ```
  <p>${message.username}</p>
  <p class="msg">${message.message}</p>
  <p>${time}</p>
  ```
  chat.appendChild(section)
}

function addMessage (message) {
  var messages = document.querySelector('#messages')
  // var messages = document.getElementById('messages')
  var li = document.createElement('li')

  var timestamp = new Date(message.timestamp)
  var time = getElapsedTime(timestamp)

  li.textContent = `${message.username} ${time}: ${message.message}`
  messages.appendChild(li)
}

$('form').submit(function () {
  var timestamp = new Date()
  var msg = {
    username: username,
    message: $('#msg').val(),
    timestamp: timestamp.toISOString()
  }
  socket.emit('chat message', msg);
  $('#msg').val('');
  return false;
});

socket.on('chat message', addMessageSegment)

socket.on('chat log', function (messages) {
  messages.forEach(addMessageSegment)
})
