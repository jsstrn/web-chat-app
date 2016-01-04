const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const md = require('markdown').markdown

// database connection
const db_user = process.env.CHAT_DB_USER
const db_pwd = process.env.CHAT_DB_PWD
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
  Message.model('Message')
    .find()
    .exec((err, messages) => {
      if (err) return console.error(err)
      socket.emit('chat log', messages)
    })

  socket.on('chat message', msg => {
    // parse markdown
    msg.message = md.toHTML(msg.message)
    // save message to database
    const message = new Message(msg)
    message.save(err => {
      if (err) return console.error(err)
    })
    // send message to all clients
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected.')
  })
})

const PORT = process.env.PORT || 3000
http.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`)
})
