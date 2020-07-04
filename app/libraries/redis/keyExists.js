const redisClient = require('./redis')


module.exports = (key) => redisClient.EXISTS(key,(err,res) => console.log(res));