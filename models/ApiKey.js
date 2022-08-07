const mongoose = require('mongoose')
const api_key_generator = require('../utils/api_key_generator')

const apiKey = new mongoose.Schema(
    {
        api_key: { type: String, required: true },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User',
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        versionKey: false,
    }
)

module.exports = mongoose.model('ApiKey', apiKey)
