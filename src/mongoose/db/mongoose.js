
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1/Kotes'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}
mongoose.connect(url, options, function (error, client) {
    if (error) return console.log('server error!')
    console.log('data base connection established!')
})
