const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const gameRouter = require('./gameRouter')
const reviewRouter = require('./reviewRouter')

router.use('/user', userRouter)
router.use('/game', gameRouter)
router.use('/review', reviewRouter)

module.exports = router