const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    bcrypt = require('../../../../libraries/bcrypt');

const changePassword = async (req, res) => {

    let userDetails = await User.findById(req.user.id).select('password').then(resp => resp).catch(err => res.status(500).json({message:"Some error occured"}))

    if(bcrypt.comparePassword(req.body.oldPassword,userDetails.password)){
        await bcrypt.hashPassword(req.body.password, (err, pass) => {
            User.updateOne({ _id: req.user.id }, {
                $set: {
                    password: pass
                }
            }).then(rs =>
                res.status(200).json({
                    message: "Password change successfull"
                })).catch(err => res.status(500).json({ message: err.message }))
    
        })
    }else{
        res.status(202).json({
            message: "Old Password does not match."
        })
    }


}

module.exports = {
    changePassword
}
