const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

// database connection
const db_user = 'user' // process.env.CHAT_DB_USER
const db_pwd = 'password' // process.env.CHAT_DB_PWD
const db_url =  'mongodb://' + db_user + ':' + db_pwd + '@ds027835.mongolab.com:27835/webchat'
mongoose.connect(db_url)
const db = mongoose.connection

const Message = mongoose.model('Message', {
  "username": String,
  "message": String,
  "timestamp": Object
})

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('A user connected.')
  // send chat log on new user connection
  Message.model('Message').find((err, messages) => {
    if (err) return console.error(err)
    // io.emit('chat log', messages)
    socket.emit('chat log', messages)
  })

  socket.on('chat message', msg => {
    // save message to database
    const message = new Message(msg)
    message.save(err => {
      if (err) return console.error(err)
    })
    console.log(`Message: ${msg.message}`)
    // send message to all clients
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected.')
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
