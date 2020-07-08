const redis = require('../../libraries/redis/redis')


const addOn = (req,res,next) => {
    redis.HMGET("key",req.headers.authorization,(err,response) => {
        console.log(response)
    })
    next();
 }

module.exports = addOn