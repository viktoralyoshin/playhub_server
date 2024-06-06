const Router = require('express')
const router = new Router()
const gameController = require('../controllers/gameController.js')

router.post('/create', gameController.create)
router.post('/get', gameController.get)
router.get('/getall', gameController.getAll)
router.get('/getnew', gameController.getNew)
router.post('/search', gameController.search)

module.exports = router