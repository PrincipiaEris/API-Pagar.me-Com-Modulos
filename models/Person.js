const mongoose = require('mongoose')

const Person = mongoose.model('gente',{
    idpag: String,
    user: String,
    pass: String,
    card: String
})

module.exports = Person