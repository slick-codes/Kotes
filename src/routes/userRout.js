const app = require('express')
const router = app.Router()

const usersSchema = require('./../mongoose/schema/userSchema')

const { isBodyExist } = require('./../middlewares/post')

//Signup Rout
router.post('/signup', isBodyExist, function (req, res) {
    const { body } = req

    const user = new usersSchema(body)
    user.save(function (error, user) {
        if (error) return res.status(500).send({
            sucess: false,
            error,
            strError: error.toString()
        })

        return res.status(201).send(user)
    })

})


//Login Rout
router.post('/login', isBodyExist, function (req, res) {


})

module.exports = router