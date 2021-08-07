const app = require('express')
const router = app.Router()
const { isEmail } = require('validator')

const usersSchema = require('./../mongoose/schema/userSchema')
const { isBodyExist } = require('./../middlewares/post')
//import authentication function
const { authentication: auth } = require('./../middlewares/auth')
//importing auth utiltie functions 
const { validateRefreshToken, deleteRefreshToken } = require('./../utilities/auth/tokens')


//login middleware
async function login(req, res) {
    try {
        const { password, username } = req.body
        const validUser = await usersSchema.checkCredential(password, username)
        if (!validUser) {
            return res.status(400).send({
                sucess: false,
                msg: 'no match found!',
            })
        }
        const tokens = await validUser.generateTokens()

        res.send({
            sucess: true,
            status: 201,
            msg: 'login sucessful',
            tokens
        })
    } catch (error) {
        res.status(400).send({
            sucess: false,
            error,
            strError: error.toString()
        })
    }
}

//Signup Rout
router.post('/signup', isBodyExist, function (req, res, next) {
    const { body } = req

    const user = new usersSchema(body)
    user.save(function (error, user) {
        if (error) return res.status(400).send({
            sucess: false,
            error,
            strError: error.toString()
        })
        if (!req.query.hasOwnProperty('login'))
            return res.status(201).send(user)
        next()
    })
}, login)


//Login Rout
router.post('/login', isBodyExist, login)

//Logout Rout
// you need to parse in an access token header and a refreshtoken header to loggout
router.post('/logout', async function (req, res) {
    try {
        const refreshToken = req.headers['refreshtoken'].replace('Bearer ', '').trim()

        const verifyToken = await validateRefreshToken(refreshToken)
        if (!verifyToken)
            throw new Error('invalde token')
        await deleteRefreshToken(refreshToken)
        res.status(200).send({
            sucess: true,
            status: 200
        })
    } catch (error) {
        res.status(400).send({
            sucess: false,
            error,
            status: 400,
            strError: error.toString()
        })
    }
})

// get user data
router.get('/me', auth, function (req, res) {
    res.send(req.user)
})


module.exports = router