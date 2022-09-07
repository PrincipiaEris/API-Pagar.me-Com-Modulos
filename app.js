const express = require('express')
const mongoose = require('mongoose')
const app = express()
const personRoutes = require('./routes/personRoutes')
const cardRoutes = require('./routes/cardRoutes')
require('dotenv').config()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use('/person', personRoutes)

const dbuser = process.env.DB_USER
const dbpass = encodeURI(process.env.DB_PASSWORD)

mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@polychord.ls74kan.mongodb.net/?retryWrites=true&w=majority`
).then(()=>{
    console.log("Conectado")
}).catch((err)=>console.log(err))

app.listen(3000)