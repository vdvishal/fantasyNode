const signUp = require('./signUp')
const login = require('./login')
 
const resetPassword = require('./OTP')
const changePassword = require('./changePassword')
const logout = require('./logout')
 
const kyc = require('./kyc')

const withdraw = require('./withdraw')

const bank = require('./bank')

module.exports = {
    signUp,
    login,
    resetPassword,
    changePassword,
    logout,
    kyc,
    withdraw,
    bank
}