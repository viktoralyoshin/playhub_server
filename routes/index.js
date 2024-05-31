const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const gameRouter = require('./gameRouter')

router.use('/user', userRouter)
router.use('/game', gameRouter)

module.exports = router