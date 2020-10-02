const basicAuth = require('express-basic-auth')

module.exports = basicAuth({
    users: { 'app': 'qwewqinasdoinoinacino' }
})