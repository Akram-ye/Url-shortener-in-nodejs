const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema(
    {
        urlCode: { type: String, unique: true },
        longUrl: String,
        shortUrl: String,
        title: { type: String, default: 'N/A' },
        clicks: { type: Number, default: 0 },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        versionKey: false,
    }
)

module.exports = mongoose.model('Url', urlSchema)
