const
    mongoose = require('mongoose'),
    User = mongoose.model('Admin'),
    bcrypt = require('../../../../libraries/bcrypt');

 

const changePassword = async (req, res) => {
    try {

    if(req.body.password.length < 5){
        res.status(202).json({
            message: "Password length must be greater than 5 char"
        })
    }
        
    let userDetails = await User.findById(req.user.id).select('password').then(resp => resp)

    if(bcrypt.comparePassword(req.body.oldPassword,userDetails.password)){
        await bcrypt.hashPassword(req.body.password, (err, pass) => {
            User.updateOne({ _id: req.user.id }, {
                $set: {
                    password: pass
                }
            }).then(rs =>
                res.status(200).json({
                    message: "Password Updated"
                }))
    
        })
    }else{
        res.status(202).json({
            message: "Old Password does not match."
        })
    }
        } catch (err) {
            res.status(502).json({ message: err.message })  
        }

}

module.exports = {
    changePassword
}
