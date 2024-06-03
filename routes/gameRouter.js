const Router = require('express')
const router = new Router()
const gameController = require('../controllers/gameController.js')

router.post('/create', gameController.create)
router.get('/get', gameController.get)

module.exports = router