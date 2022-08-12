const express = require('express')
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const config = require('config')
const Url = require('../models/Url')
const pageTitle = require('../utils/get_url_title')

const { validateUser } = require('../controller/auth')

const router = express.Router()

// @route   GET /
// @desc    root route
router.get('/', (req, res) => {
    return res.send(req.hostname)
})

// @route   POST /api/shorten
// @params  { longUrl, alias }
// @desc    Create short URL
router.post('/shorten', validateUser, async (req, res) => {
    const { longUrl, alias } = req.body
    const baseUrl = config.get('baseUrl')

    let url = await Url.findOne({ longUrl })
    let urlCode

    // check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(400).json({ message: 'Invalid base url' })
    }

    // check long url
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json({ message: 'Invalid long url' })
    }

    let title = pageTitle(longUrl)
    try {
        if (url) {
            return res
                .status(201)
                .json({ message: 'longUrl is already exist!!! ', url })
        } else {
            alias ? (urlCode = alias) : (urlCode = nanoid(10))
            const shortUrl = baseUrl + '/api/url/' + urlCode

            url = new Url({
                longUrl,
                shortUrl,
                urlCode,
                title,
            })
        }

        await url.save().then(() => {
            return res.status(201).json(url)
        })
    } catch (error) {
        if (error.code == 11000)
            return res
                .status(500)
                .json({ message: 'alias is already in use 🍔' })
        return res
            .status(500)
            .json({ message: 'Some error has occurred 🤦‍♂️', error })
    }
})

// @route     GET /api/:code
// @desc      Redirect & Update click count to/for long/original URL
router.get('/url/:code', validateUser, async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code })
        if (url) {
            const _id = url._id
            let clicks = url.clicks
            clicks++
            await Url.findByIdAndUpdate(
                { _id },
                { $set: { clicks } },
                { new: true }
            )
                .exec()
                .then(url => {
                    return res.redirect(url.longUrl)
                })
                .catch(error => {
                    return res.status(201).json({ error })
                })
        } else {
            return res
                .status(404)
                .json({ message: 'No url found with provided code' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Some error has occurred', error })
    }
})

// @route     GET /api/urls
// @desc      Get All Urls
router.get('/getUrls', validateUser, async (req, res) => {
    try {
        let url = await Url.find().sort({ created_at: -1 })
        let count = await Url.estimatedDocumentCount()

        if (url) {
            return res.status(200).json({ count, url })
        } else {
            return res.status(400).json({ message: 'no urls available' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Some error has occurred', error })
        process.exit(1)
    }
})

// @route     GET /api/:code
// @desc      Delete URL with given code
router.delete('/deleteUrl/:code', validateUser, async (req, res) => {
    try {
        const url = await Url.deleteOne({ urlCode: req.params.code })

        if (url.deletedCount === 1) {
            return res.status(201).json({
                message: 'url deleted successfully 🤟',
            })
        } else {
            return res.status(201).json({
                message: 'No documents matched the query. Deleted 0 documents.',
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Some error has occurred', error })
    }
})

module.exports = router
