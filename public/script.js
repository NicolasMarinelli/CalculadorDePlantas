const socket= io({ withCredentials: true,})

let subCounter=1

async function subspopulate(url){
    let list= document.getElementById(`sub${subCounter}`)
    try{
    const response = await fetch(url);
    let data = await response.json();

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
    let parentDiv = other.parentNode
    if(subCounter<6){
        subCounter++
        let div = document.createElement('div')
        div.id=`div${subCounter}`
        div.className= 'conti'
        div.innerHTML= `<select name="Subselect" id="sub${subCounter}">
        <option value="0" required>Elegir sustrato</option> </select>
        <input type="number" min="0" step="1" id="cant${subCounter}" placeholder="toneladas/m3" value="0" class="num-input">`
        parentDiv.insertBefore(div,other)
        subspopulate('/names')
        oDOM[`sub${subCounter}`] =document.getElementById(`sub${subCounter}`)
        oDOM[`cant${subCounter}`] =document.getElementById(`cant${subCounter}`)
        } else{
        console.log("maxsubstrates",subCounter)
    }
 })

 // eliminar sustratos 
 btnMinus.addEventListener('click',()=>{
    if(subCounter>1){
        let div= document.getElementById(`div${subCounter}`)
        div.remove()
        oDOM[`sub${subCounter}`] = null
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
    return msg
    
}

// boton de envio de objeto por el websocket

btn.addEventListener('click', ()=>{
    if(Object.values(msgCreator()).indexOf("0")===-1){
        socket.emit('message',msgCreator())
    }else{
        console.log("fill the blancks")
    }
})


// respuesta del websocket renderizada
socket.on('message',(result)=>{
    let  result2=JSON.parse(result)
    output.innerHTML = ""
    output.innerHTML+=`<table>
    <tr class="results1">
    <td> Gas Natural reemplazado:</th>
    <td><p class="results" type="number" value="${result2["gasNatural"]}"></th>
    <td>M3/día</th>
  </tr>
  <tr class="results2">
    <td >Energia electrica:</td>
    <td ><p class="results" type="number" value="${result2["Pot"]}" ></p></td>
    <td >Kw-h/día</td>
  </tr>
  <tr class="results3">
    <td>GLP reemplazado:</td>
    <td><p class="results" type="number" value="${result2["glp"]}"></p></td>
    <td>Kg/dia</td>
  </tr>
    </table>`

    // output.innerHTML +=`<h2>Volumen de digestion ${result2["volDig"]} m3</h2>
    // <h2>Biogas estimado ${result2["BiogasTotal"]} m3/día</h2>
    // <h2>Calidad de gas ${result2["CH4prom"]} %CH4</h2>`

    animation()

})

const animation= ()=>{
    let results= document.querySelectorAll(".results")
    let interval = 500
    results.forEach(result=>{
        let startValues = 0
        let endValue= result.getAttribute("value");
        let duration = Math.floor(interval/endValue);
        let counter = setInterval(()=>{
            startValues+= endValue/150;
            result.textContent = Math.floor(startValues);
            if (startValues > endValue){
                result.textContent = endValue;
                clearInterval(counter)
            }
        },duration)
    })
}
