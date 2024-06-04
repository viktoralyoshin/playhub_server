const Router = require('express')
const router = new Router()
const reviewController = require('../controllers/reviewController.js')

router.post('/create', reviewController.create)
router.post('/check', reviewController.check)

module.exports = router