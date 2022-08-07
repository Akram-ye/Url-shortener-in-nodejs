const ApiKey = require('../models/ApiKey')
const api_key_generator = require('../utils/api_key_generator')

const validateUser = async (req, res, next) => {
    let api_key = req.header('api_key')

    let api = await ApiKey.findOne({ api_key })

    if (!api) {
        return res
            .status(401)
            .json({ message: "Erorr, Your API key doesn't match" })
    }

    if (!api_key) {
        return res.status(401).json({
            message: 'Erorr, You must obtain an API key',
        })
    }
    if (api_key != api.api_key) {
        return res.status(401).json({
            message: "Erorr, Your API key doesn't match",
        })
    }

    next()
}

module.exports = { validateUser }
