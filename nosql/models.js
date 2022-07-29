const mongoose = require("mongoose")

const databaseSchema = new mongoose.Schema({
    name: {type:String,required:true,unique:true}, 
    res: {type:Number,required:true},
    st:{type:Number,required:true},
    sv:{type:Number,required:true},
    deg:{type:Number,required:true},
    bgprod:{type:Number,required:true},
    ch4:{type:Number,required:true},
    trh:{type:Number,required:true},
})

const userSchema = new mongoose.Schema({   
    email: {type: String, required:true, unique:true},
    username : {type: String, unique: true, required:true},
    data:[{
        sustrato:{type: String},
        cantidad:{type: String}
    }]
});


const Database = mongoose.model("Database",databaseSchema)
const UserDatabase  = mongoose.model("User",userSchema)

module.exports = {Database , UserDatabase}

    