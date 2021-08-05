const router = require('express').Router()
const { generateAccessToken } = require('./../utilities/auth/tokens')


// refresh access token rout
router.get('/createaccess', async function (req, res) {
    try {
        const refreshToken = req.headers['refreshtoken'].replace('Bearer ', '')
        // console.log(refreshToken)
        const accessToken = await generateAccessToken(refreshToken)
        res.status(201).send({
            sucess: true,
            status: 201,
            tokens: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        res.status(400).send({
            sucess: false,
            status: 400,
            error,
            strError: error.toString()
        })
    }
})



module.exports = router
