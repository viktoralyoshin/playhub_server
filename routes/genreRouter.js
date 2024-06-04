const Router = require('express')
const router = new Router()
const genreController = require('../controllers/genreController.js')

router.post('/create', genreController.create)
router.get('/getall', genreController.getAll)

module.exports = router