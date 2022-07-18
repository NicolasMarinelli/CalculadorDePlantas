const socket= io()

const substrates = ["Silo de Maiz","Estiercol de Cerdo","Estiercol de Vaca"]
let list = document.getElementById("Substrates")
substrates.forEach((item)=>{
    let option = document.createElement('option');
    option.value = item;
    list.appendChild(option);
    
 });


// objects of DOM
let oDOM={}
oDOM.sub1 = document.getElementById('sub1')
oDOM.sub2 = document.getElementById('sub2')
oDOM.sub3 = document.getElementById('sub3')
oDOM.cant1 = document.getElementById('cant1')
oDOM.cant2 = document.getElementById('cant2')
oDOM.cant3 = document.getElementById('cant3')
let btn= document.getElementById("send")
let output= document.getElementById('result')
let btnPlus = document.getElementById('plus')



let other = document.getElementById("perro")
let subCounter=3

btnPlus.addEventListener('click',()=>{
    if(subCounter<6){
    let div= document.createElement('div')
    document.body.insertBefore(div,other)
    subCounter++
    div.id = `sub${subCounter}`
    div.innerHTML=`<div class="conti"><input type="text" id="sub${subCounter}" placeholder="sustrato${subCounter}" list ="Substrates"><input type="text" id="cant${subCounter}" placeholder="toneladas/m3"></div>`
    
    oDOM[`sub${subCounter}`] =document.getElementById(div.id)
    oDOM[`cant${subCounter}`] =document.getElementById(`cant${subCounter}`)
    } else{
        console.log("maxsubstrates",subCounter)
    }
 })



const msgCreator = ()=>{
    let msg={}
    let i=1
    while (oDOM[`sub${i}`]){
        msg[`sub${i}`]=oDOM[`sub${i}`].value
        msg[`cant${i}`]=oDOM[`cant${i}`].value
        i++
    }
    
    return msg
    
}


btn.addEventListener('click', ()=>{
    socket.emit('message',msgCreator())
})

socket.on('message',(result)=>{
    console.log(result)
    result2=JSON.parse(result)
    output.innerHTML = ""
    output.innerHTML += `<p>
    <strong>  ${result}
    </p>
    <h1>Volumen de digestion ${result2["volDig"]}</h1>
    <h2>Biogas estimado ${result2["BiogasTotal"]}</h2>
    <h2>Calidad de gas ${result2["CH4prom"]}</h2>`
})
