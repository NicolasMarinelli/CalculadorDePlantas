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


const bgc = obj=>obj.st*obj.sv*obj.bgprod
const bgmet = obj=>obj.st*obj.sv*obj.bgprod*obj.ch4

const ef= (bgt,ch4)=>{
  let met=bgt*ch4/24
  if(met>250){
    return 0.41*bgt*ch4*9.95/100
  }else if(met>135){
    return 0.39*bgt*ch4*9.95/100
  }else if (met>69){
    return 0.37*bgt*ch4*9.95/100
  }else {
    return 0.35*bgt*ch4*9.95/100
  }
}


const bgcalc = async (data)=>{
  try{
  let [obj,cant]=await datacolector(data)
  let caudal = cant.map((x)=>x!=0?parseInt(x):x=0).reduce((acc,cur)=>acc+cur)
  let vol = Math.floor(caudal*Math.max(...Object.keys(obj).map(sub=>obj[sub].trh)))
  let bgT = Math.round(cant.reduce((acc,cur,i)=>acc+parseInt(cur)*bgc(obj[`sub${i}`]),0))
  let ch4p = Math.round((cant.reduce((acc,cur,i)=>acc+parseInt(cur)*bgmet(obj[`sub${i}`]),0)/bgT)*100)
  let pot = Math.round(ef(bgT,ch4p))

  r = {
      volDig:vol + " m3",
      BiogasTotal: bgT+ " m3/dia",
      CH4prom: ch4p + "%CH4", 
      Pot: pot + "Kw/dia"
    }
  return r
    
  } catch(err){
    console.log(err)
  }
  }
  


module.exports = bgcalc