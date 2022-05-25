const socket= io()

// objects of DOM
let sub1 = document.getElementById('sub1')
let sub2 = document.getElementById('sub2')
let sub3 = document.getElementById('sub3')
let cant1 = document.getElementById('cant1')
let cant2 = document.getElementById('cant2')
let cant3 = document.getElementById('cant3')
let btn= document.getElementById("send")
let output= document.getElementById('result')

btn.addEventListener('click', ()=>{
    console.log(sub1.value)
    socket.emit('message',{
        sub1: sub1.value,
        cant1: cant1.value,
        sub2: sub2.value,
        cant2: cant2.value,
        sub3: sub3.value,
        cant3: cant3.value,
    })
})

socket.on('message',(result)=>{
    output.innerHTML = ""
    output.innerHTML += `<p>
    <strong>  ${result}
    </p>`
})
