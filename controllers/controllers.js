const Database = require('../nosql/models')


const getAllSubstrates = async()=>{
    try{
    const substrates= [...await Database.find({})]
    names= substrates.map(v=>v.name)
    return names
    }catch(err){
        console.log(err)
    }
}

module.exports= getAllSubstrates