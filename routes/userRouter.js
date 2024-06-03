const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController.js')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/verify', userController.verify)
router.post('/logout', userController.logout)

module.exports = router