const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Blacklist = mongoose.model('Blacklist');

    

const logout = async (req, res) => {

    let userToken = await User.findById(req.user.id).select('refToken').lean().exec().then(response => response)

    let token = {
        userId: req.user.id,
        'token':  userToken.refToken
    }

    token = new Blacklist(token)

    await token.save().then()
    res.status(200).json({message:"Logged Out"});
}

module.exports = {
    logout
}