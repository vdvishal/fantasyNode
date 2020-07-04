const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    randomize = require('randomatic'),
    moment = require('moment'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('../../../../libraries/bcrypt')

const sendOTP = (req, res) => {
    User.findOne({ email: req.body.email }, 'email').lean().exec()
        .then(user => {
            if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

            const code = randomize('AAAA0')
            const time = moment().unix();
            User.updateOne({ _id: user._id }, {
                $set: {
                    passwordOTP: {
                        time,
                        code,
                        active: true
                    }
                }
            }).then(re => { res.status(401).json({ message: "Code has been sent to your email" }) })

            // send mail            
        })
}

const verifyOTP = (req, res) => {

    if(req.body.type === 1){
        User.findById(req.body.id).select('OTP').then(response => {
            
            const token = jwt.sign({ id: response._id }, 'secret');

            if (response.OTP.code === req.body.code && response.OTP.active && moment().unix() - response.OTP.time < 600) {
                User.updateOne({_id:req.body.id},{$set:{
                    activated:true
                    }
                }).then(response => res.status(200).json({ message: "Verification Successfull", token: token })).catch()
            } else {
                res.status(406).json({ message: false });
            }
        })
    }else if(req.body.type === 2){
        User.findOne({ email: req.body.email }, 'email OTP').lean().exec()
        .then(user => {
            if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

            const token = jwt.sign({ id: user._id }, 'resetPassword', {
                expiresIn: 60 * 3
            });

            if (user.passwordOTP.code === req.body.code && user.passwordOTP.active && moment().unix() - user.passwordOTP.time < 600) {
                res.status(200).json({ message: true, data: token });
            } else {
                res.status(406).json({ message: false });
            }
            User.updateOne({ _id: user._id }, {
                $set: {
                    passwordOTP: {
                        time: 0,
                        code: null,
                        active: false
                    }
                }
            })
        })
    }


}

const resetPassword = (req, res) => {
    jwt.verify(req.headers.authorization, 'resetPassword', function (err, decoded) {
        if (err) {
            return res.status(403).json({ message: err.message })
        } else {
            bcrypt.hashPassword(req.body.password, (err, pass) => {
                User.findById(decoded.id).select('blacklist').lean().exec().then(user => {
                    if (user.blacklist && user.blacklist.indexOf(req.headers.authorization) > -1) {
                        res.status(403).json({ message: "Unauthorized" })
                    } else {
                        User.updateOne({ _id: decoded.id }, {
                            $set: {
                                password: pass
                            }, $push: {
                                blacklist: req.headers.authorization
                            }
                        }).then(rs =>
                            res.status(200).json({
                                message: "Password change successfull"
                            })).catch(err => res.status(500).json({ message: err.message }))
                    }
                })

            })


        }
    });




}


module.exports = {
    sendOTP,
    verifyOTP,
    resetPassword
}
