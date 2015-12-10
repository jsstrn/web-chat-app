var socket = io()
var username = window.prompt('Enter your username')
var msg = document.querySelector('#msg')

if (!username) {
  var ran = Math.floor((Math.random() * 999) + 100)
  username = 'user' + ran
}

document.querySelector('#username').textContent = username

function getElapsedTime (timestamp) {
  var ms = Date.now() - timestamp.getTime()
  var min = ms/60000
  var time = ''
  if (min > 1439) {
    time = `${Math.round(min/1440)}d`
  } else if (min > 59) {
    time = `${Math.round(min/60)}h`
  } else if (min >= 1) {
    time = `${Math.round(min)}m`
  } else if (min > 0) {
    var sec = Math.round(min*60)
    if (sec === 0) time = 'just now'
    else time = `${sec}s`
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

socket.on('chat message', addMessageToList)

socket.on('chat log', function (messages) {
  messages.forEach(addMessageToList)
})
