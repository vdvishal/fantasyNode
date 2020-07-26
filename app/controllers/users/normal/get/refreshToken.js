const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Blacklist = mongoose.model('Blacklist');




/**
 * @function profile
 *  get
 * 
 */


const refreshToken = async (req, res) => {

    let tokenArr = await Blacklist.find({'token':req.headers['authorization']}).lean().exec().then(response => response)
    if(tokenArr.length > 0){
        return res.status(496).send({ message: 'Token Expired' });
    }
    const token = jwt.sign({ id: req.user.id }, process.env.Access_key, { expiresIn:  `${process.env.ACCESSTOKEN}`, subject: 'user' });
    res.send({ message: "Token", token: token })
}

module.exports = {
    refreshToken,
}