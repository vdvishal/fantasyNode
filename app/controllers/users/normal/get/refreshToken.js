const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



/**
 * @function profile
 *  get
 * 
 */


const refreshToken = async (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN.toString() + 's', subject: 'user' });
    res.send({ message: "Token", data: token })
}

module.exports = {
    refreshToken,
}