const express = require('express')
const connectDb = require('./config/db')
const config = require('config')
const bodyParser = require('body-parser')

const app = express()

// connect to database
connectDb()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//  routes
app.use(
    '/api',
    require('./routes/url'),
    require('./routes/auth'),
    require('./routes/healthcheck')
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
