const validator = require('validator')
const mongoose = require('mongoose')


const quoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 20,
    },
    quote: {
        type: String,
        required: true,
        maxLength: 250,
        validate(value) {
            if (value.trim() == '')
                throw new Error('quotes cannot be empty!')
        }
    },
    reactions: [{
        liked: {
            type: Boolean,
            required: true,
        },
        by: {
            type: String,
            required: true
        }
    }],
    creator: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Users'
    }
})

const quotes = mongoose.model('Quotes', quoteSchema)
module.exports = quotes
