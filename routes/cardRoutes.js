const router = require('express').Router()
const fetch = require('node-fetch')


router.patch('/editar', async(req, res) =>{
    const people = req.body
    const {user, pass} = people
    try {
        const dbesta = await Person.findOne({user:user})
        const passo = dbesta.pass
        const id = dbesta.id
        if(!dbesta){
            res.json({message: "O usuário não existe."})
            return
        }
        if(pass != passo) {
            res.json({message: "As senhas não coincidem."})
            return
        }
        const respost = await fetch(`https://api.pagar.me/core/v5/customers/${id}`, {
        method: 'put',
        body: JSON.stringify(people),
        headers: {'Authorization':`Basic ${process.env.KEY}==`,
        'Accept':'application/json'}
    })
    const corpse = await respost.text()
    const parsedCorp = JSON.parse(corpse)
    if(!parsedCorp.message){
        res.status(201).json({message: 'O usuário foi editado com sucesso.'})
    }else {
        const aerroryed = Object.entries(parsedCorp.errors)
        const jasonafex = JSON.stringify(aerroryed)

        res.status(400).json({message:jasonafex})
    }
    } catch (error){
        res.status(500).json({error: error})
    }
})