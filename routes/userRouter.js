const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController.js')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/verify', userController.verify)
router.post('/logout', userController.logout)
router.post('/get', userController.getUser)

module.exports = router