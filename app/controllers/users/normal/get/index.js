const activateAccount = require('./activateAccount')
const profile = require('./profile')
const refToken = require('./refreshToken')
const transaction = require('./transaction')

module.exports = {
    profile,
    activateAccount,
    refToken,
    transaction
}