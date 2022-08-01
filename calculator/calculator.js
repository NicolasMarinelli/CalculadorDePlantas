const datacolector = require("./utils")

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

const aguacalc = (obj,cant)=>{
  let solid= Object.keys(obj).map((sub,i)=>obj[sub].st*cant[i]).reduce((acc,cur)=>acc+cur)
  let total = caudalCalc(cant)
  let degradacion=  Object.keys(obj).map((sub,i)=>obj[sub].st*obj[sub].sv*obj[sub].deg*cant[i]).reduce((acc,cur)=>acc+cur)
  let materiaseca = (solid-degradacion)/(total-degradacion)
  if(materiaseca>0.1){
    let agua=(solid-degradacion)/0.1+degradacion-total
    return agua
  }
  return 0
}

const caudalCalc=(cant)=>{
  return cant.map((x)=>x!=0?parseInt(x):x=0).reduce((acc,cur)=>acc+cur)
}


const bgcalc = async (data)=>{
  try{
  let [obj,cant]=await datacolector(data)
  let agua = aguacalc(obj,cant)
  let caudal = caudalCalc(cant)+agua
  let vol = Math.floor(caudal*Math.max(...Object.keys(obj).map(sub=>obj[sub].trh)))
  let bgT = Math.round(cant.reduce((acc,cur,i)=>acc+parseInt(cur)*bgc(obj[`sub${i}`]),0))
  let ch4p = Math.round((cant.reduce((acc,cur,i)=>acc+parseInt(cur)*bgmet(obj[`sub${i}`]),0)/bgT)*100)
  let pot = Math.round(ef(bgT,ch4p))

  r = {
      volDig:vol ,
      BiogasTotal: bgT,
      CH4prom: ch4p, 
      Pot: pot,
      gasNatural: Math.floor(ch4p*bgT),
      glp: Math.floor(ch4p*bgT*0.82)
    }
  return r
    
  } catch(err){
    console.log(err)
  }
  }
  

module.exports = bgcalc