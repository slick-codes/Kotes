const userSchema = require('../../mongoose/schema/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


async function validateRefreshToken(refreshToken) {
    // let id, user

    try {
        var user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        var id = user.id
        user = await userSchema.findById(id)
    } catch (error) {
        //remove refreshToken from data base if it has expired
        console.log('token has expired')
        user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken)
        await user.save()
    }
    // check if refreshToken exsit in database
    const isExist = user.refreshTokens.some(token => token.token === refreshToken)
    return isExist ? user : null
}

// delete refreshToken
async function deleteRefreshToken(refreshToken) {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await userSchema.findById(id)

    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken)

    await user.save(function (error, user) {
        if (error) throw new Error('error deauthenticating user')
        return true
    })
}
//delete All refreshToken
async function deleteAllRefreshToken(refreshToken) {
    const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await userSchema.findById(id)

    user.refreshTokens = []
    await user.save(function (error, user) {
        if (error) throw new Error('error deauthenticating user')
        return true
    })
}

//Generate Access token from Refresh Token
const generateAccessToken = async function (refreshToken) {
    const isRefreshTokenValid = await validateRefreshToken(refreshToken)

    if (!isRefreshTokenValid) {
        throw new Error('invalid token')
    }

    const user = isRefreshTokenValid
    const userObj = user.toObject()
    delete userObj.refreshTokens
    delete userObj.password

    const token = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRING_SECRET
    })
    return token
}


module.exports = {
    validateRefreshToken,
    generateAccessToken,
    deleteRefreshToken,
    deleteAllRefreshToken
}