const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    redisClient = require('../../../../libraries/redis/redis'),
    redisClientEx = require('../../../../libraries/redis/keyExists');

const logout = (req, res) => {
    console.log(req.headers.authorization);
    
    redisClient.HDEL("key",req.headers.authorization)
    // redisClient.HSET(req.headers.authorization,"String",1,function(err) {
    //     if (err) throw err;
    // })
    
    // redisClient.EXPIRE(req.headers.authorization,10,function(err) {
    //     if (err) throw err;
    // })

    //  redisClient.FLUSHALL()
    res.send();
}

module.exports = {
    logout
}