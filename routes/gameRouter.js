const Router = require('express')
const router = new Router()
const gameController = require('../controllers/gameController.js')

router.post('/create', gameController.create)
router.post('/get', gameController.get)
router.get('/getall', gameController.getAll)

module.exports = router