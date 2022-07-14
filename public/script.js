const socket= io()

let list = document.getElementById("Substrates")

async function substrates(url){
    try{
    const response = await fetch(url);
    var data = await response.json();
    
    data.forEach((item)=>{
        let option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
        
     });
    }
    catch(err){
    console.log(err)    
    }
}
substrates('/names')



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


let other = document.getElementById('container')
let subCounter=3

btnPlus.addEventListener('click',()=>{
    let div= document.createElement('div')
    document.body.insertBefore(div,other)
    subCounter++
    div.id = `sub${subCounter}`
    div.innerHTML='<input type="text" id="sub1" placeholder="sustrato1" list ="Substrates">\
    <input type="text" id="cant1" placeholder="toneladas/m3">'
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
    result2=JSON.parse(result)
    output.innerHTML = ""
    output.innerHTML += `<p>
    <strong>  ${result}
    </p>
    <h1>Volumen de digestion ${result2["volDig"]}</h1>
    <h2>Biogas estimado ${result2["BiogasTotal"]}</h2>
    <h2>Calidad de gas ${result2["CH4prom"]}</h2>
    <h2>Energia disponible ${result2["Pot"]}</h2>`
})
