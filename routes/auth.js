const express = require('express')
const { body, validationResult } = require('express-validator')

const api_key_generator = require('../utils/api_key_generator')
const User = require('../models/User')
const ApiKey = require('../models/ApiKey')

const router = express.Router()

router.get('/auth', (req, res) => {
    return res.send('auth')
})

// user signin
router.post(
    '/auth/register',
    [
        body('username').notEmpty().withMessage('Please enter username'),
        body('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('Please enter valiad email!')
            .notEmpty()
            .withMessage('Email must be presented!'),
        body(
            'password',
            'Password must be at least 6 chars and must contain a numbers'
        )
            .isLength({ min: 6 })
            .matches(/\d/)
            .notEmpty()
            .withMessage('Please enter password!'),
    ],
    async (req, res) => {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(404).json({ error: error.array()[0].msg })
        }

        let { username, email, password } = req.body
        let user = await User.findOne({ username, email })

        try {
            if (user) {
                return res.status(201).json({
                    message: 'User already exist 🍔',
                    user,
                })
            } else {
                user = new User({
                    username,
                    email,
                    password,
                })
                await user
                    .save()
                    .then(() => {
                        return res
                            .status(200)
                            .json({ message: 'success', key, user })
                    })
                    .catch(error => {
                        return res.status(201).json({ message: 'error', error })
                    })
            }
        } catch (error) {
            if (error.code == 11000)
                return res
                    .status(500)
                    .json({ message: 'Username or Email is already exist 🍔' })
            return res
                .status(500)
                .json({ message: 'Some error has occurred 🤦‍♂️', error })
        }
    }
)

// login route
router.post(
    '/auth/login',
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('please enter valiad email'),
    body('password').notEmpty().withMessage('pleas enter password'),
    async (req, res) => {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(404).json({ error: error.array()[0].msg })
        }

        let { email, password } = req.body

        try {
            let user = await User.findOne({ email })

            if (!user) return res.status(404).json({ message: 'No user found' })

            if (!user.comparePassword(password)) {
                return res
                    .status(401)
                    .json({ error: 'Username or password is incorrect' })
            }

            return res.status(200).json({ user })
        } catch (error) {
            console.log(error)
        }
    }
)

// generate_api_key
router.post(
    '/auth/generate_api_key',
    body('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('please enter valiad email')
        .notEmpty()
        .withMessage('email must be presented'),
    body('password').notEmpty().withMessage('pleas enter password'),
    async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(404).json({ error: error.array()[0].msg })
        }

        let { email, password } = req.body

        const api_key = api_key_generator.generateKey()
        // const api_key = api_key_generator.generateSecretHash(key)
        console.log('KEY::::::\n', api_key)

        try {
            let user = await User.findOne({ email })
            console.log('USER::::::\n', user)

            if (!user)
                return res.status(404).json({ message: 'User not found!' })

            if (!user.comparePassword(password)) {
                return res
                    .status(401)
                    .json({ error: 'Invalid email or password!' })
            }
            let app_key = await ApiKey.findOne({ owner: user._id })

            console.log('APP_KEY:::::\n', app_key)

            // if (!app_key) {
            let key = new ApiKey({
                api_key,
                owner: user._id,
            })

            await key
                .save()
                .then(() => {
                    return res.status(200).json({
                        message:
                            'Success, This api key is confidential it will only show once so keep it in a safe place',
                        key,
                    })
                })
                .catch(error => {
                    return res.status(400).json({ message: error.message })
                })
            // }

            if (app_key) {
                const _id = app_key._id
                await ApiKey.findByIdAndUpdate(
                    { _id },
                    { $set: { api_key } },
                    { new: true }
                )
                    .exec()
                    .then(() => {
                        return res.status(200).json({
                            message:
                                'Success, This api key is confidential it will only show once so keep it in a safe place',
                            api_key,
                        })
                    })
                    .catch(error => {
                        return res.status(201).json({ message: error.message })
                    })
            }
        } catch (error) {
            return res.status(201).json({ message: error.message })
        }
    }
)

module.exports = router
