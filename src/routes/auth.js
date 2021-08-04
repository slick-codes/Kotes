const tokens = require('./../utilities/auth/tokens')
const userSchema = require('./../mongoose/schema/userSchema')
const jwt = require('jsonwebtoken')

async function authentication(req, res, next) {
    try {
        const accessToken = req.headers['authorization'].replace('Bearer ', '')
        console.log(accessToken)
        const verifiedUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const users = await userSchema.findById(verifiedUser._id)
        if (!users)
            throw new Error('By Authenticated')

        req.user = verifiedUser
        next()

    } catch (error) {
        res.status(403).send({
            sucess: false,
            status: 403,
            message: 'Be Authented',
            error,
            strError: error.toString()
        })
    }
}

module.exports = {
    authentication
}