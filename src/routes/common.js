const router = require('express').Router()

function notFoundPage(req, res) {
    res.json({
        status: 404,
        sucess: false,
        msg: '404 no haddle exsit'
    })
}


router.post('*', notFoundPage)
router.get('*', notFoundPage)
router.patch('*', notFoundPage)
router.delete('*', notFoundPage)

module.exports = router