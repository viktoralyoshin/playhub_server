const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const gameRouter = require('./gameRouter')
const reviewRouter = require('./reviewRouter')
const genreRouter = require('./genreRouter')
const tagRouter = require('./tagRouter')
const articleRouter = require('./articleRouter')
const collectionRouter = require('./collectionRouter')

router.use('/user', userRouter)
router.use('/game', gameRouter)
router.use('/review', reviewRouter)
router.use('/genre', genreRouter)
router.use('/tag', tagRouter)
router.use('/article', articleRouter)
router.use('/collection', collectionRouter)

module.exports = router