const mongoose = require('mongoose')
const Database = require('./nosql/models')


const findSustrateByName =  (substrateName) => {
  return new Promise((resolve, reject)=>{
    Database.find({name:substrateName}, (err, substrato) =>{
      if (err) {return console.log(err)};
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
  let [name,cant]=dataHandler(data);
  let obj = {}
  let sub = ""
      for(let i =0;i<name.length;i++){
      sub = `sub${i}`
      obj[sub]=await findSustrateByName(name[i])
      }
  return [obj,cant]
}


const bgcalc = async (data)=>{
  let [obj,cant]=await datacolector(data)
  let caudal = cant.map((x)=>x!=0?parseInt(x):x=0).reduce((acc,cur)=>acc+cur)
  let vol = caudal* Math.max(obj.sub0['trh'],obj.sub1.trh)
  let bgT= 0
  let ch4p = 0
  
  r = {
      volDig:vol,
      BiogasTotal: bgT,
      CH4prom: ch4p,
    }

    return r
  }
  


module.exports = bgcalc