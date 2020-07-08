const
    mongoose = require('mongoose'),
    User = mongoose.model('Users');


const changePassword = (req, res) => {
    bcrypt.hashPassword(req.body.password, (err, pass) => {
        User.updateOne({ _id: req.user.id }, {
            $set: {
                password: pass
            }
        }).then(rs =>
            res.status(200).json({
                message: "Password change successfull"
            })).catch(err => res.status(500).json({ message: err.message }))

    })}

module.exports = {
    changePassword
}
