const socket= io()


// objects of DOM
let sub1 = document.getElementById('sub1')
let sub2 = document.getElementById('sub2')
let sub3 = document.getElementById('sub3')
let cant1 = document.getElementById('cant1')
let cant2 = document.getElementById('cant2')
let cant3 = document.getElementById('cant3')
let btn= document.getElementById("send")


btn.addEventListener('click', ()=>{
    console.log(sub1.value)
    socket.emit('chat:message',{
        sub1: sub1.value,
        cant1: cant1.value
    })
})
