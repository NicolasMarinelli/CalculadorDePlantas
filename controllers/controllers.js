const Database = require('../nosql/models').Database

//-------------------------//
//--geting all subtrates--//
//-------------------------//
const getAllSubstrates = async()=>{
    try{
    const substrates= [...await Database.find({})]
    names= substrates.map(v=>v.name)
    return names
    }catch(err){
        console.log(err)
    }
}

//---------------------------//
// -posting a new subtrate--//
//---------------------------//
const postOneSubstrate = async(data)=>{
    try{
        Database.create(data)

    }catch(err){
        console.log(err)
    }
}

module.exports= {getAllSubstrates, postOneSubstrate}