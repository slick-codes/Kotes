const router = require('express').Router()
const quoteSchema = require('./../mongoose/schema/quoteSchema')

//PUBLIC ROUTS


//get quotes by the user id
router.get('/api/:creatorId/quotes', async function (req, res) {
    try {
        console.log(req.params)
        let { creatorId } = req.params
        const quotes = await quoteSchema.find({ creator: creatorId })

        if (!quotes)
            throw new Error('theres no existing quote')
        res.status(201).send({
            sucess: true,
            status: 201,
            quotes
        })
    } catch (error) {
        res.status(404).send({
            status: 404,
            sucess: false,
            error,
            strError: error.toString()
        })
    }
})


module.exports = router