const {Database,UserDatabase} = require('../nosql/models')

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
        await UserDatabase.create(data)

    }catch(err){
        console.log(err)
    }
}


//---------------------------//
// -patching a new subtrate--//
//---------------------------//



module.exports= {getAllSubstrates, postOneSubstrate}