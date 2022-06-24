const mongoose = require('mongoose')
const Database = require('./nosql/models')


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
  let [name,cant]=dataHandler(data);
  let obj = {}
  let sub = ""
     for(let i =0;i<name.length;i++){
      sub = `sub${i}`
      obj[sub]=await findSustrateByName(name[i])
      }
  return [obj,cant]
}


const bgc= (obj)=>{
  return obj.st*obj.sv*obj.bgprod
}

const bgmet = (obj)=>{
  return obj.st*obj.sv*obj.bgprod*obj.ch4
}


const bgcalc = async (data)=>{
  let [obj,cant]=await datacolector(data)
  let caudal = cant.map((x)=>x!=0?parseInt(x):x=0).reduce((acc,cur)=>acc+cur)
  if (obj.sub0==undefined){
    obj.sub0={}
    obj.sub0.trh=0
  }
  if (obj.sub1==undefined){
    obj.sub1={}
    obj.sub1.trh=0
  }
  if(obj.sub2==undefined){
    obj.sub2={}
    obj.sub2.trh=0
  }
  let vol = caudal* Math.max(obj.sub0.trh,obj.sub1.trh,obj.sub2.trh)
  let bgT = cant.reduce((acc,cur,i)=>acc+parseInt(cur)*bgc(obj[`sub${i}`]),0)
  let ch4p = cant.reduce((acc,cur,i)=>acc+parseInt(cur)*bgmet(obj[`sub${i}`]),0)/bgT
  
  r = {
      volDig:vol + " m3",
      BiogasTotal: bgT+ " m3/dia",
      CH4prom: ch4p + "%CH4", 
    }
    return r
  }
  


module.exports = bgcalc