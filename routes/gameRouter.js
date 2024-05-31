const Router = require('express')
const router = new Router()
const gameController = require('../controllers/gameController.js')

router.post('/create', gameController.create)

module.exports = router