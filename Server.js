const express = require('express')
const http = require('http')
const socketIo = require('socket.io')(http, {
  transports: ["websocket"]
})

const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(express.static(__dirname + "/public"))
app.get("/", (req, res) => {
  res.render("Multiplayer.html")
})

const positions = {}

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id)
  
  positions[socket.id] = {x:280, y:110}
  
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id)
  })

  socket.on("updatePosition", (data) => {
    positions[socket.id].x = data.x
    positions[socket.id].y = data.y
  })
})
http.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
