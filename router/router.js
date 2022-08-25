const express= require('express')
const {vistaPrincipal,getPageSubtrates,postSustrate}= require('../controllers/pageController')
const {findResults}=require('../controllers/controllers')

const router= express.Router()

router.get("/dash",vistaPrincipal)

router.get("/results",findResults)

// router.get("/add",getPageSubtrates)
// router.post("/add",postSustrate)

module.exports ={routes: router}

