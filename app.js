const express = require('express')
const app = express()
require('dotenv').config()

const SocketIO= require('socket.io')

//static midlleware

app.use(express.static('./public'))

//setting port
const port= process.env.PORT || 8080

//stating server
const server = app.listen(port,()=>{
    console.log(`server is conected to port ${port}`)
})

// setting up socketIO

const io = SocketIO(server)

io.on('connection',(socket)=>{
    console.log('new connection:',socket.id)
})


