

function isBodyExist(req, res, next) {
    const body = req.body
    if (!body) return res.status(400).json({
        msg: 'invalid request',
        sucess: false
    })
    next()
}

module.exports = { isBodyExist }