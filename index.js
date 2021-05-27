const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

const messages = [], members = []

io.sockets.on('connection', socket => {
   socket.on('disconnect', () => {
      const index = members.findIndex(m => m.id === socket.id)
      members.splice(index, 1)
      io.emit('send-history', {
         messages, members
      })
   })

   io.emit('send-history', {
      messages, members
   })

   socket.on('send-front', data => {
      const candidate = members.find(m => m.id === data.id)
      if (!candidate) {
         members.push({
            id: data.id,
            name: data.memberName
         })
      }
      messages.push(data)
      io.emit('send-back', {
         messages, members
      })
   })
})
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'templates', 'index.html'))
})

server.listen(3000, () => {
   console.log('listening on *:3000')
})