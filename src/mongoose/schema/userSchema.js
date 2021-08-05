const mongoose = require('mongoose')
const validator = require('validator')
const { isIncludeSymbols } = require('./../../utilities/validate')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const usersSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        validate(value) {
            if (isIncludeSymbols(value, ['-'])) {
                throw new Error('first name requires no symbol')
            }
        }
    },
    lastName: {
        type: String,
        required: false,
        validate(value) {
            if (isIncludeSymbols(value, ['-'])) {
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
    },
    refreshTokens: [{
        token: {
            required: true,
            type: String
        }
    }]
}, {
    timestamps: true
})


usersSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 8, function (error, hashedPassword) {
        if (error) throw new Error('there was an error with hashing')
        user.password = hashedPassword
        next()
    })
})

//check user credentials
usersSchema.statics.checkCredential = async function (password, username) {
    const validUser = await Users.findOne({ username })
    if (!validUser) return null

    const isPassMatch = bcrypt.compare(password, validUser.password)
    if (!isPassMatch)
        return null

    return validUser
}
usersSchema.methods.generateTokens = async function () {
    let user = this

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIREING_SECRET
    })
    // console.log(jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET))
    user.refreshTokens.push({ token: refreshToken })
    await user.save()

    // create access token 
    user = user.toObject()
    delete user.password
    delete user.refreshTokens
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRING_SECRET })

    return {
        sucess: true,
        loggedIn: true,
        refreshToken,
        accessToken
    }
}

const Users = mongoose.model('Users', usersSchema)

module.exports = Users