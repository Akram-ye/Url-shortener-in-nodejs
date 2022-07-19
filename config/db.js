const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongodbUrl')

const connectDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
        })

        console.log('Mongodb connected...')
        return 'Mongodb connected...'
    } catch (err) {
        console.error(err.message)
        process.exit()
    }
}

module.exports = connectDb
