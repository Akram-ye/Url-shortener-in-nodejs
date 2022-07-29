const User = require('../models/User')
const api_key_generator = require('../utils/api_key_generator')

const { scryptSync, randomBytes } = require('crypto')

const validateUser = async (req, res, next) => {
    let api_key = req.header('api_key')
    let { email } = req.body

    // TODO: validate user without checking it's email (validate only with api_key)

    let user = await User.findOne({ email })

    if (!api_key) {
        return res.status(401).json({
            message: 'Erorr, You must obtain an API key',
        })
    }
    if (!api_key_generator.compareKeys(user.api_key, api_key)) {
        return res.status(401).json({
            message: "Erorr, Your API key doesn't mutch",
        })
    }

    next()
}

module.exports = { validateUser }
