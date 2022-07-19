const { scryptSync, randomBytes, timingSafeEqual } = require('crypto')

function generateKey(size = 32, format = 'base64') {
    const buffer = randomBytes(size)
    return buffer.toString(format)
}

function generateSecretHash(key) {
    const salt = randomBytes(8).toString('hex')
    const buffer = scryptSync(key, salt, 64)
    return `${buffer.toString('hex')}.${salt}`
}

function compareKeys(storedKey, suppliedKey) {
    const [hashedPassword, salt] = storedKey.split('.')

    const buffer = scryptSync(suppliedKey, salt, 64)
    return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer)
}

module.exports = { generateKey, generateSecretHash, compareKeys }
