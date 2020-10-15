const redis = require('redis')
require('dotenv').config({ path: './.env' })

const client = redis.createClient({
    port:process.env.REDIS_PORT,
    host: process.env.REDIS_IP,
    password: process.env.REDIS_PASSWORD
})

module.exports = client;