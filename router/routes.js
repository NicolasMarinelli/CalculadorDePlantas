const router = require('express').Router()
const getAllSubstrates= require('./controllers/controllers')


router.route("/names").get(getAllSubstrates)


module.exports = router