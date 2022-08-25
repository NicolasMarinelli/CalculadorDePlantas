const vistaPrincipal = (req,res)=>{
    res.render('layout')
}

const vistaTablas = (req,res)=>{
    res.render('tables')
}

const postSustrate= (req,res)=>{
    res.send("sustrato cargado!")
    console.log(req.body)
    postOneSubstrate(req.body).then(res=>console.log("sustrate saved?"))
}

const getPageSubtrates=(req,res)=>{
    res.sendFile('../noPublic/add.html',{ root : __dirname});
}



module.exports = {
    vistaPrincipal,
    vistaTablas,
    postSustrate,
    getPageSubtrates
}