
const mongoose = require("mongoose")

const databaseSchema = new mongoose.Schema({
    name: String, 
    res: String,
    st:Number,
    sv:Number,
    deg:Number,
    bgprod:Number,
    ch4:Number,
    trh: Number,
})


const Database = mongoose.model("Database",databaseSchema)

module.exports = Database