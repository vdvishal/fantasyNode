const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    bcrypt = require('../../../../libraries/bcrypt');

    const Joi = require('joi')

const schema = Joi.object({
    password:Joi.string().alphanum().length(5).required(),
    oldPassword:Joi.string().required(),
})

const changePassword = async (req, res) => {
    try {
        await schema.validateAsync(req.body) 

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
            res.status(500).json({ message: err.message })  
        }

}

module.exports = {
    changePassword
}
