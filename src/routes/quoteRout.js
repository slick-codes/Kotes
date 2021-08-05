const router = require('express').Router()
const { authentication: auth } = require('./../middlewares/auth')
const quoteSchema = require('./../mongoose/schema/quoteSchema')
const { isBodyExist } = require('./../middlewares/post')
const mongoose = require('mongoose')


//Private Routs
router.post('/create', auth, async function (req, res) {
    try {
        const { body, user } = req
        body.creator = user._id
        const quote = new quoteSchema(body)
        const saved = await quote.save()
        res.status(201).send({
            sucess: true,
            status: 201,
            data: saved
        })
    } catch (error) {
        res.status(403)
    }
})

// reaction handler
router.post('/reaction/:quoteId', auth, async function (req, res) {
    try {
        if (!req.query.hasOwnProperty('like') || !req.params.hasOwnProperty('quoteId')) {
            res.sendStatus(400)
        }
        const { quoteId } = req.params
        const liked = req.query.like

        const quote = await quoteSchema.findById(quoteId)

        // Toggle the like state if user already liked before
        for (let reaction of quote.reactions) {
            if (reaction.by === req.user.username) {
                reaction.liked = !reaction.liked
                await quote.save()
                return res.status(201).send({
                    sucess: true,
                    status: 201
                })
            }
            // set like to true if user have never liked before
            quote.reactions.push({
                liked: true,
                by: req.user.username
            })
            const saved = await quote.save()
            console.log(saved)
            res.send({
                sucess: true,
                status: 201
            })
        }


        quote.reactions.push({
            liked,
            by: req.user.username
        })
        await quote.save()
        res.send(quote)
    } catch (error) {
        res.status(400).send({
            sucess: false,
            status: 400,
            error,
            strError: error.toString()
        })
    }
})



router.get('/me', auth, isBodyExist, async function (req, res) {
    try {
        const { body, user } = req
        const id = user.id
        const quotes = await quoteSchema.find({ creator: user._id })
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