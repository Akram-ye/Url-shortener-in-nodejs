const ApiKey = require('../models/ApiKey')
const api_key_generator = require('../utils/api_key_generator')

const validateUser = async (req, res, next) => {
    let api_key = req.header('api_key')

    let app_key = await ApiKey.findOne({ api_key })

    try {
        // check if user did not add api_key to his request
        if (!api_key) {
            return res.status(401).json({
                message: 'Erorr, You must obtain an API key',
            })
        }

        // check if there is no api_key matched in our db
        if (!app_key) {
            return res
                .status(401)
                .json({ message: "Erorr, Your API key doesn't match" })
        }

        next()
    } catch (error) {
        return res.status(201).json({ message: error.message })
    }
}

module.exports = { validateUser }
