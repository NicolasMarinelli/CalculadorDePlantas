const express = require('express')
const app = express()
require('dotenv').config()
const connectDB= require('./nosql/dbnosql')
const SocketIO= require('socket.io')
const bgcalc = require('./calculator/calculator')
const {getAllSubstrates,postOneSubstrate, postOneUser}= require('./controllers/controllers');
const router= require("./router/router")
const session = require('express-session')

const expressLayouts = require("express-ejs-layouts")


const sessionMiddleware=session({
    secret: 'Perro',
    resave: true,
    saveUninitialized: true
})

app.use(sessionMiddleware);

app.set("view engine", 'ejs')
app.use(expressLayouts)

//------------------------------------------------------//
//-----------------STATIC MIDDLEWARE--------------------//
//------------------------------------------------------//
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./public/assets/img/ilustrations'))

//------------------------------------------------------//
// geting the list of possible subtrates  //
//------------------------------------------------------//

app.get('/names',async (req,res)=>{
    const names =await getAllSubstrates()
    res.json(names)
})


//------------------------------------------------------//
//getting the page for the form to add more substrates and posting new ones //

app.get('/add',(req,res)=>{
    res.sendFile('noPublic/add.html',{ root : __dirname});
})


app.post('/add',(req,res)=>{
    res.send("sustrato cargado!")
    console.log(req.body)
    postOneSubstrate(req.body).then(res=>console.log("sustrate saved?"))
})


//-- usamos el reouter para el dashboard--//


app.use(router.routes)


//-----------------//
//handling errors//

app.use('/',(err,req,res,next)=>{
    console.log(err.name,err.stack,err.code)
    res.status(500).json({
        msg :'something went wrong'
    })
})

//----------------//
//setting port
const port= process.env.PORT || 8080

//stating server
const server =app.listen(port,()=>{
    start()
    console.log(`server is conected to port ${port}`)})


//---------------------------------//
// setting up socketIO //

const io = SocketIO(server)

// ni idea que hace esta linea de código, pero si no está no puedo comunicar la session a travez del websocket //
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware))


io.on('connection',(socket)=>{
    socket.on('message',(data)=>{
        // transformo los datos de session y socket en un objeto posteble
        const clientData = {
            email:socket.request.session.email,
            username: socket.request.session.user,
            data: data
        } 
        
        // posteo en la base de datos los datos 
        postOneUser(clientData).then(res=>console.log("saved data"))
        

        // uso calculator.js para crear el resultado
        bgcalc(data).then(res=>socket.emit('message',JSON.stringify(res)))
        
    })
})

//---------------------------------//
// Function conection to mongo //
const start = async()=>{
    try{
        await connectDB(process.env.URI)
        console.log('conected to the database')
    }catch(error){
        console.log(error)
    }
}

// autentification

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session && req.session.user && req.session.admin)
      return next();
    else
      return res.sendStatus(401);
  };
  
//----login----//

  app.post('/main', function (req, res) {
    console.log(req.body)
    if (!req.body.name || !req.body.email) {
      res.send('login failed');    
    } else if(req.body.name  && req.body.email ) {
      req.session.user =req.body.name;
      req.session.email=req.body.email;
      req.session.admin = true;
      res.sendFile('noPublic/main.html',{ root : __dirname})
    }
  });

  // Logout endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
  });

//------------------------------------------------------//
//----- SENDING THE MAIN PAGE ------ //
//------------------------------------------------------//

app.get('/main',auth,(req,res)=>{
    res.sendFile('noPublic/main.html',{ root : __dirname});
})






