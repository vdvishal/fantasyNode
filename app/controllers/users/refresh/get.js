const jwt = require('jsonwebtoken');
const redis = require('../../../libraries/redis/redis');

module.exports = (req,res) => {
    redis.HMGET("key",req.headers.authorization,(response) => {
        if(response === undefined || response === null){
            res.status(401)
            res.send({message:"Unauthorized Entity"})
        }else{

            const token = jwt.sign({ id: user._id }, 'secret',{iat:9000});
 

            res.send({ message: "Token", token })
        }
    })
}