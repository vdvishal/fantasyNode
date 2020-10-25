const jwt = require('jsonwebtoken');
// const redis = require('../../../libraries/redis/redis');

module.exports = (req,res) => {
    const token = jwt.sign({ id: user._id }, 'secret',{iat:9000});
 

    res.send({ message: "Token", token })
}