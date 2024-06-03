const Router = require('express')
const router = new Router()
const reviewController = require('../controllers/reviewController.js')

router.post('/create', reviewController.create)

module.exports = router