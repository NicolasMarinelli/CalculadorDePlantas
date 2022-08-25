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
// --posting user data and --//
//---------------------------//
const postOneUser = async(data)=>{
    try{
        await UserDatabase.create(data)

    }catch(err){
        console.log(err)
    }
}


//---------------------------//
// -posting a new subtrate--//
//---------------------------//

const postOneSubstrate = async(data)=>{
    try{
        await Database.create(data)

    }catch(err){
        console.log(err)
    }
}

//------------------------------------//
// -looking for 1 subrtrate by name--//
//----------------------------------//

const findSustrateByName =  (substrateName) => {
    return new Promise((resolve, reject)=>{
      Database.find({name:substrateName}, (err, substrato) =>{
        if (err) {throw err};
        resolve(substrato[0])
      })
    });
  };



//------------------------------------//
// -looking for dato to dashboard (not finneshed)-//
//----------------------------------//




const findResults= async(req,res)=>{
    try{
        const result= [...await UserDatabase.find({})]
        names= result.map(v=>v.data)
        res.json({names})


        }catch(err){
            console.log(err)
        }
    }
    



module.exports= {getAllSubstrates, postOneSubstrate,postOneUser,findSustrateByName,findResults}