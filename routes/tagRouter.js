const Router = require('express')
const router = new Router()
const tagController = require('../controllers/tagController.js')

router.post('/create', tagController.create)
router.get('/getall', tagController.getAll)
router.post('/get', tagController.get)

module.exports = router