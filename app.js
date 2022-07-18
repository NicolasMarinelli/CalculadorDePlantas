const express = require('express')
const app = express()
require('dotenv').config()


const connectDB = require('./nosql/dbnosql')

const SocketIO= require('socket.io')
const bgcalc = require('./calculator')

const getAllSubstrates= require('./controllers/controllers')

//static midlleware

app.use(express.static('./public'))


// geting the list of possible subtrates

app.get('/names',async (req,res)=>{
    const names =await getAllSubstrates()
    res.json(names)
})

//getting the page for the form to add more substrates

app.get('/add',(req,res)=>{
    res.sendFile('public/add.html',{ root : __dirname});
})

app.post('/add',(req,res)=>{
    res.json({msg:'new sebtrate generated'})
})

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


