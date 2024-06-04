const Router = require('express')
const router = new Router()
const articleController = require('../controllers/articleController.js')

router.post('/create', articleController.create)
router.get('/getall', articleController.getAll)

module.exports = router