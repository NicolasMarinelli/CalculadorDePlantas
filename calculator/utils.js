const Database = require('../nosql/models').Database

const findSustrateByName =  (substrateName) => {
    return new Promise((resolve, reject)=>{
      Database.find({name:substrateName}, (err, substrato) =>{
        if (err) {throw err};
        resolve(substrato[0])
      })
    });
  };

  const dataHandler= (data)=>{
    const keys = Object.keys(data);
    const name= keys.filter((keys,i)=> i%2==0|| i==0).map((name)=>data[name])
    const cant = keys.filter((keys,i)=> i%2!==0).map((name)=>data[name])
  
    return [name,cant]
  }
  
  const datacolector=async(data)=>{
    try{
    let [name,cant]=dataHandler(data);
    let obj = {}
    let sub = ""
       for(let i =0;i<name.length;i++){
        sub = `sub${i}`
        obj[sub]=await findSustrateByName(name[i])
        }
    return [obj,cant]
      } catch(err){
        console.log(err)
      }
    
  }

module.exports = datacolector