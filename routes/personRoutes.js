const router = require('express').Router()
require('dotenv').config()
const { find } = require('../models/Person')
const Person = require('../models/Person')
const fetch = require('node-fetch')

router.post('/', async (req, res) => {
    const people = req.body.persona
    const card = req.body.card
    const {user, pass} = people
    const veri = await Person.findOne({user:user})
    if(!veri){
        res.json('Esse user já existe')
        return
    }

    try {
        const respost = await fetch('https://api.pagar.me/core/v5/customers', {
        method: 'post',
        body: JSON.stringify(people),
        headers: {'Authorization':`Basic ${process.env.KEY}==`,
        'Accept':'application/json'}
    })
    const corpse = await respost.text()
    const parsedCorp = JSON.parse(corpse)
    const idpag = parsedCorp.id
    const obejo = {
        code:people.code,
        plan_id:people.planid,
        payment_method:people.metopaga,
        customer_id:idpag,
        card:req.body.card
    }
    const gresponse = await fetch(`https://api.pagar.me/core/v5/subscriptions`, {
        method: 'post',
        body: JSON.stringify(obejo),
        headers: {'Authorization':`Basic ${process.env.KEY}==`,
        'Accept':'application/json'}
    })
    const borpse = await gresponse.text()
    const parsedBorp = JSON.parse(borpse)
    if(!parsedCorp.message&&!parsedBorp.message){
        const objdeal = {idpag, user, pass, card}
        await Person.create(objdeal)
        const responect = await Person.findOne({user:user, pass:pass})
        res.status(201).json({idpag, responect})
    }else {
        const aerroryed = Object.entries(parsedCorp.errors)
        const jasonafex = JSON.stringify(aerroryed)
        const aberroyed = Object.entries(parsedBorp.errors)
        const jasonabex = JSON.stringify(aberroyed)
        res.status(400).json({user_errors:jasonafex,card_errors:jasonabex})
    }
    } catch (error){
        res.status(500).json({error: error})
    }
})

router.get('/', async(req, res) => {
    try {
        const resget = await fetch('https://api.pagar.me/core/v5/customers', {
            method: 'GET',
            body: null,
            headers: {'Authorization':`Basic ${process.env.KEY}==`,
            'Accept':'application/json'}
        })
        const corpse = await resget.text()
        res.status(200).json(corpse)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async(req, res) =>{
    const id = req.params.id

    try {
        const person = await Person.findOne({_id: id})

        res.status(200).json(person)
        if(!person){
            res.status(422).json({message: 'O usuário não foi encontrado.'})
            return
        }
    } catch (error) {
        res.status(500).json({error:error})
    }
})

router.delete('/deletar', async (req, res) => {
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
        method: 'delete',
        body: JSON.stringify(people),
        headers: {'Authorization':`Basic ${process.env.KEY}==`,
        'Accept':'application/json'}
    })
    await respost.text()
    await Person.deleteOne({user:user})
    res.status(200).json({message:"O usuário foi excluido com sucesso."})
    } catch (error) {
        res.status(500).json({error:error})
    }
})

module.exports = router