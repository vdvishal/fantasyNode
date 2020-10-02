const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Orders = mongoose.model('Orders'),
    Appconfig = mongoose.model('Appconfigs'),
    randomize = require('randomatic'),
    hash = require('../../../../libraries/bcrypt'),
    moment = require('moment'),
    jwt = require('jsonwebtoken'),
    sendSms = require('../../../../libraries/twilio'),
    bcrypt = require('../../../../libraries/bcrypt');

const sendOTP = (req, res) => {

    if(req.body.type === 1){
    User.findOne({ _id: req.body.verifyId }, 'email').lean().exec()
        .then(user => {
            if (!user) return res.status(204).json({ message: 'The number is not registered. Please register.' });

            const code = randomize('0000')
            const time = moment().unix();
            User.findByIdAndUpdate(req.body.verifyId, {
                $set: {
                    OTP: {
                        time,
                        code,
                        type:req.body.type,
                        active: true
                    }
                }
            }).then(resp => {                
                sendSms(resp.phone.phone,`Your verification code: ${code}`)
                 res.status(200).json({ message: "OTP sent" })
             })

            // send mail            
        })
    }else if(req.body.type === 2){
        User.findOne({ "phone.phone": req.body.number }, 'email').lean().exec()
        .then(user => {
            if (!user) return res.status(204).json({ message: 'The number is not registered. Please register.' });

            const code = randomize('0000')
            const time = moment().unix();
            User.findByIdAndUpdate(user._id, {
                $set: {
                    OTP: {
                        time,
                        code,
                        type:req.body.type,
                        active: true
                    }
                }
            }).then(resp => {                
                sendSms(resp.phone.phone,`Your verification code: ${code}`)
                 res.status(200).json({ message: "OTP sent",data:user._id })
             })

            // send mail            
        })
    }else if(req.body.type === 3){
        User.findById(req.body.verifyId, 'email').lean().exec()
        .then(user => {
            if (!user) return res.status(204).json({ message: 'No user registered.' });

            const code = randomize('0000')
            const time = moment().unix();
 
            hash.hashPassword(req.body.password, (err, response) => {
                if (err) {        
                    return res.status(502).json({ message: 'Err...........' });
                } else {

                    User.findByIdAndUpdate(user._id, {
                        $set: {
                            phone: {
                                countryCode: "+91",
                                phone: req.body.phone,
                                isCurrentlyActive: true,
                            },
                            password: response,
                            OTP: {
                                time,
                                code,
                                type:req.body.type,
                                active: true
                            }
                        }
                    }).then(resp => {                
                        sendSms(resp.phone.phone,`Your verification code: ${code}`)
                         res.status(200).json({ message: "OTP sent",userId:user._id,new:true })
                     })
                     
                 }
            })


            // send mail            
        })
    }
}

 
let refBonus = 25;

const verifyOTP = (req, res) => {

    if(req.body.type === 1){
        User.findById(req.body.id).lean().then(response => {
            
            if(response.OTP.active && moment().unix() - response.OTP.time > 120){
                
                

                
              return res.status(406).json({ message: "OTP expired" });
            }
 
            if (response.OTP.code === req.body.code && response.OTP.active && moment().unix() - response.OTP.time < 120) {
                User.updateOne({_id:req.body.id},
                    {
                        $set:{
                            activated:true
                        },
                        $inc: {
                            "totalRefers": 0,
                            "wallet.bonus" : refBonus
                        }
                }).then(resp => {

                    const token = jwt.sign({ id: req.body.id }, process.env.Access_key, { expiresIn: `${process.env.ACCESSTOKEN}`, subject: 'user' });
                   
                    let order = new Orders({
                        "amount" :  parseInt(refBonus)*100,
                        "status" : "bonus",
                        "orderId": "Signup Bonus",
                        "notes" : {
                            "userId" : req.body.id
                        }
                    })
            
                    order.save().then().catch();

                    const refToken = jwt.sign({ id: req.body.id }, 'ref', { expiresIn: `${process.env.REFTOKEN}`, subject: 'user' });
                    
                    User.updateOne({_id:req.body.id},{$set:{refToken:refToken}}).then().catch()
                    

                    if (response.refferCode) {
                        // Appconfig.findOne({}).then(config => {
                        //     refBonus = config.refBonus
                        //     checkReferalCode(response)
                        // })
                        checkReferalCode(response)

                    }
                   
                    res.status(200)
                    res.send({ message: "Verification success", token, refToken: refToken })

                }).catch()
            } else {
                res.status(406).json({ message: "Wrong code, try again!" });
            }
        })
    }else if(req.body.type === 2){
        User.findOne({ "phone.phone": req.body.phone }, 'OTP').lean().exec()
        .then(user => {
            if (!user) return res.status(204).json({ message: 'The number is not registered. Please register.' });

            if(user.OTP.active && moment().unix() - user.OTP.time > 120){
                
                
              return res.status(406).json({ message: "OTP expired" });
            }

            let token = jwt.sign({id:user._id},process.env.RESET_key,{ expiresIn: `${process.env.RESET_TIME}`, subject: 'user' })

            if (user.OTP.code === req.body.code && user.OTP.active && moment().unix() - user.OTP.time < user) {
                res.status(200).json({ message: true, data: token });
            } else {
               return res.status(406).json({ message: "Wrong code, try again!" });
            }
        })
    }


}

const resetPassword = (req, res) => {

    User.findById(req.body.verifyId).select('OTP').then(response => {
         
         

        if(response.OTP.active && moment().unix() - response.OTP.time > 12000){
            
            

            
          return res.status(406).json({ message: "OTP expired" });
        }

        if (response.OTP.code === req.body.OTP && response.OTP.active && moment().unix() - response.OTP.time < 12000) {
            bcrypt.hashPassword(req.body.password, (err, pass) => {
                User.updateOne({ _id: req.body.verifyId }, {
                    $set: {
                        password: pass,
                        'OTP.active':false
                    },
                }).then(rs =>
                    res.status(200).json({
                        message: "Password Updated, login again"
                    })).catch(err => res.status(502).json({ message: err.message }))
            })
        } else {
            res.status(406).json({ message: "Wrong code, try again!" });
        }
    })
}



const checkReferalCode = (data) => {
    
    
         if (data.refferCode && data.refferCode != "" && data.refferCode != undefined) {
            User.findOne({refCode: data.refferCode}, (err, referrer) => {
                if (err) {
                    return "ERRRR";
                } else if (referrer === null) {
                    return  ({ message:"Refferal code is invalid" })
                } else {
                    let referralData = {
                        userId: data._id,
                        registeredOn: moment().unix(),
                        firstname: data.firstName,
                        lastName: data.lastName || "",
                        email: (data.email).toLowerCase() || "",
                        countryCode: data.phone.countryCode || "",
                        phone: data.phone.phone || "",
                    }
                    updateReferals(referralData,referrer._id, (err, res) => {
                        updateProfile(data._id, {
                            userId: referrer._id,
                        }, (err, res) => {
                             
                        })
                    })
                }
            });
        }  
}


const updateReferals = (referralCode,refferId, callBack) => {
    
    

    User.updateOne({ _id: new mongoose.mongo.ObjectId(refferId) }, {
        $push: {
            "referrals": {
                userId: referralCode.userId,
                registeredOn: referralCode.registeredOn,
                firstname: referralCode.firstname,
                lastName: referralCode.lastName,
                email: referralCode.email,
                countryCode: referralCode.countryCode,
                phone: referralCode.phone
            }
        }, $inc: {
            "totalRefers": 1,
        }
    }).then(response => {
        callBack(null, response);
    }).catch(err => {
        callBack(err);
    })

}

const updateProfile = (userId, data, callBack) => {
    
    

    User.updateOne({ _id: new mongoose.mongo.ObjectId(userId) }, {
        $set: {refferData:data}
    }).then(response => {
        callBack(null, response);
    }).catch(err => {
        callBack(err);
    })
}

module.exports = {
    sendOTP,
    verifyOTP,
    resetPassword
}
