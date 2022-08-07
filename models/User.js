const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, trim: true },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email is required',
        },
        password: {
            type: String,
            required: true,
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

userSchema.pre('save', function (next) {
    let user = this

    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error)
            }
            user.password = hash
            return next()
        })
    })
})

userSchema.methods.comparePassword = function (password, callback) {
    return bcrypt.compareSync(
        password,
        this.password,
        function (error, isMatch) {
            if (error) {
                return callback(error)
            }
            callback(null, isMatch)
        }
    )
}

module.exports = mongoose.model('User', userSchema)
