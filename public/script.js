var socket = io()
var username = window.prompt('Enter your username')
var msg = document.querySelector('#msg')

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

function addMessageToList (message) {
  var chat = document.querySelector('.chat')
  var section = document.createElement('section')

  var timestamp = new Date(message.timestamp)
  var time = getElapsedTime(timestamp)

  section.innerHTML = `
  <p>${message.username}</p>
  <p>${message.message}</p>
  <p>${time}</p>`

  chat.appendChild(section)
  section.scrollIntoView()
}

// function checkMessage () {
//   if (event.keyCode !== 13) return
//   if (event.)
// }

function sendMessageToServer (event) {
  console.log(event)
  if (event.type === 'keydown' && event.keyCode !== 13) return
  if (msg.value === '') return
  var timestamp = new Date()
  var message = {
    username: username,
    message: msg.value,
    timestamp: timestamp.toISOString()
  }
  socket.emit('chat message', message);
  msg.value = ''
}

var btn = document.querySelector('#btn')
btn.addEventListener('click', sendMessageToServer, false)

msg.addEventListener('keydown', sendMessageToServer, false)

// $('form').submit(function () {
//   var timestamp = new Date()
//   var message = {
//     username: username,
//     message: msg.val(),
//     timestamp: timestamp.toISOString()
//   }
//   socket.emit('chat message', message);
//   msg.val('');
//   return false;
// });

socket.on('chat message', addMessageToList)

socket.on('chat log', function (messages) {
  messages.forEach(addMessageToList)
})
