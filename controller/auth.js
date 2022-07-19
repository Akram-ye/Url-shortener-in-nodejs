const User = require('../models/User')
const api_key_generator = require('../utils/api_key_generator')

const validateUser = async (req, res, next) => {
    let api_key = req.header('api_key')
    let fullUrl = req.originalUrl

    let { email } = req.body
    let user = await User.findOne({ email })
    let loginPath = '/api/auth/login'
    let registerPath = '/api/auth/register'

    if (fullUrl != loginPath && fullUrl != registerPath) {
        if (!api_key) {
            return res.status(401).json({
                message: 'Erorr, You must obtain API key',
            })
        }

        if (!api_key_generator.compareKeys(user.api_key, api_key)) {
            return res.status(401).json({
                message: "Erorr, Your API key doesn't mutch",
            })
        }
    }

    next()
}

module.exports = { validateUser }
