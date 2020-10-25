const
    mongoose = require('mongoose'),
    User = mongoose.model('Admin'),
    moment = require('moment'),
    jwt = require('jsonwebtoken');

    
const activateUser = (req, res) => {

    jwt.verify(req.query.token,process.env.Activation_Key,(err,decoded) => {
        if(err){
            
            res.status(498).json({message:"Link Expired"})
        }else{

        User.updateOne({ email: decoded.email }, {
            $set: {
                activated: true
            }
        }).then(rs =>
            res.status(200).json({
                message: "Account activated"
            })).catch(err => res.status(502).json({ message: err.message }))
        }
    })


}
 


module.exports = {
    activateUser
}
