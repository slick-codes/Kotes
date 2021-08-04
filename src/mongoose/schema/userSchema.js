const mongoose = require('mongoose')
const validator = require('validator')
const { isIncludeSymbols } = require('./../../utilities/validate')
const bcrypt = require('bcrypt')


const usersSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        validate(value) {
            if (isIncludeSymbols(value)) {
                throw new Error('first name requires no symbol')
            }
        }
    },
    lastName: {
        type: String,
        required: false,
        validate(value) {
            if (isIncludeSymbols(value)) {
                throw new Error('last name requires no symbol')
            }
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (isIncludeSymbols(value, ['_', '-']))
                throw new Error('username can only have intigers , strings , _ and or -')
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    }
}, {
    timestamp: true
})


usersSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 8, function (error, hashedPassword) {
        if (error) throw new Error('there was an error with hashing')
        user.password = hashedPassword
        next()
    })
})

const Users = mongoose.model('Users', usersSchema)

module.exports = Users