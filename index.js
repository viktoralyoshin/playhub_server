const express = require("express")
const cors = require("cors")
const router = require('./routes/index')
const cookieParser = require("cookie-parser")
const fileUpload = require('express-fileupload');
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))
app.use(cookieParser())
app.use(fileUpload())
app.use(express.static(path.resolve(__dirname, 'games')))
app.use(express.json())
app.use('/api', router)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()