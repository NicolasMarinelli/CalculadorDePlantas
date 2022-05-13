const express = require('express')
const app = express()
require('dotenv').config()

//static midlleware

app.use(express.static('./public'))



//setting port
const port= process.env.PORT || 8080

//stating server
app.listen(port,()=>{
    console.log(`server is conected to port ${port}`)
})