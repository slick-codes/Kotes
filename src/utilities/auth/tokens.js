const userSchema = require('../../mongoose/schema/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


async function validateRefreshToken(refreshToken) {
    const userID = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await userSchema.findById(userID)

    const isExist = user.refreshTokens.some(token => token.token === refreshToken)
    return isExist ? user : null
}

// delete refreshToken
async function deleteRefreshToken(refreshToken) {
    const userID = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await userSchema.findById(userID)

    user.refreshTokens = user.refreshTokens.filter(tokenObj => { tokenObj.token !== refreshToken })
    await user.save(function (error, user) {
        if (error) throw new Error('error deauthenticating user')
        return true
    })
}
//delete All refreshToken
async function deleteAllRefreshToken(refreshToken) {
    const userID = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await userSchema.findById(userID)

    user.refreshTokens = []
    await user.save(function (error, user) {
        if (error) throw new Error('error deauthenticating user')
        return true
    })
}

//Generate Access token from Refresh Token
const generateAccessToken = async function (refreshToken) {
    const isRefreshTokenValid = await validateRefreshToken(refreshToken)
    if (!isRefreshTokenValid)
        throw new Error('invalid refresh token!')

    const user = isRefreshTokenValid
    const userObj = user.toObject()
    delete userObj.refreshTokens
    delete userObj.password

    const token = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET)
    return token
}


module.exports = {
    validateRefreshToken,
    generateAccessToken,
    deleteRefreshToken,
    deleteAllRefreshToken
}