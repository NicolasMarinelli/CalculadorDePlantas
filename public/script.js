const socket= io()

let subCounter=1

async function subspopulate(url){
    let list= document.getElementById(`sub${subCounter}`)
    try{
    const response = await fetch(url);
    var data = await response.json();
    data.forEach((item)=>{
        let option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        list.appendChild(option);
        })
    }catch(err){
    console.log(err)    
    }
}
subspopulate('/names')

// objects of DOM
let oDOM={}
oDOM.sub1 = document.getElementById('sub1')
oDOM.cant1 = document.getElementById('cant1')
let btn= document.getElementById("send")
let output= document.getElementById('result')
let btnPlus = document.getElementById('plus')
let btnMinus =document.getElementById('minus')



// Agregar mas sustratos y sumarlos al DOM
btnPlus.addEventListener('click',()=>{
    let other = document.getElementById("perro")
    if(subCounter<6){
        subCounter++
        let div = document.createElement('div')
        div.id=`div${subCounter}`
        div.className= 'conti'
        div.innerHTML= `<select name="Subselect" id="sub${subCounter}">
        <option value="0">Elegir sustrato</option></select>
        <input type="number" min="0" step="1" id="cant${subCounter}" placeholder="toneladas/m3">`
        document.body.insertBefore(div,other)
        subspopulate('/names')
        oDOM[`sub${subCounter}`] =document.getElementById(`sub${subCounter}`)
        oDOM[`cant${subCounter}`] =document.getElementById(`cant${subCounter}`)
        } else{
        console.log("maxsubstrates",subCounter)
    }
 })

 btnMinus.addEventListener('click',()=>{
    if(subCounter>1){
        let div= document.getElementById(`div${subCounter}`)
        div.remove()
        console.log("removed")
        subCounter--
    }
 })


 // funcion que crea el mensaje que será enviado por el websocket
const msgCreator = ()=>{
    let msg={}
    let i=1
    while (oDOM[`sub${i}`]){
        msg[`sub${i}`]=oDOM[`sub${i}`].value
        msg[`cant${i}`]=oDOM[`cant${i}`].value
        i++
    }
    console.log(msg)
    return msg
    
}

// boton de envio de objeto por el websocket

btn.addEventListener('click', ()=>{
    socket.emit('message',msgCreator())
})


// respuesta del websocket renderizada
socket.on('message',(result)=>{
    console.log(result)
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
