const express = require('express')
const app = express()
require('dotenv').config()

const connectDB = require('./nosql/dbnosql')

const SocketIO= require('socket.io')
const bgcalc = require('./calculator')

//static midlleware

app.use(express.static('./public'))

//handling errors

app.use('/',(err,req,res,next)=>{
    console.log(err.name,err.stack,err.code)
    res.status(500).json({
        msg :'something went wrong'
    })
})

//setting port
const port= process.env.PORT || 8080

// conection to mongo
const start = async()=>{
    try{
        await connectDB(process.env.URI)
        console.log('conected to the database')
    }catch(error){
        console.log(error)
    }
}

//stating server
const server =app.listen(port,()=>{
    start()
    console.log(`server is conected to port ${port}`)})


// setting up socketIO

const io = SocketIO(server)

io.on('connection',(socket)=>{
    console.log('new connection:',socket.id);

    socket.on('message',(data)=>{
        // uso calculator.js para crear el resultado

        bgcalc(data).then(res=>socket.emit('message',JSON.stringify(res)))
      
    })
})


