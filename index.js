const express = require('express')
const connectDb = require('./config/db')
const config = require('config')
const bodyParser = require('body-parser')
const { validateUser } = require('./controller/auth')

const app = express()

// connect to database
connectDb()

app.use(express.json())

// define routes
app.use(
    '/api',
    validateUser,
    require('./routes/url'),
    require('./routes/auth'),
    require('./routes/healthchecker')
)

// server
const port = config.get('port')
app.listen(port, error => {
    if (error) {
        console.log('error to launch a server \n' + error)
        return
    }
    console.log(
        `Service endpoint http://localhost:${port}, You are good to go 🚀`
    )
})
