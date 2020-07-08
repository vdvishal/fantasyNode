'use strict'
const mongoose = require('mongoose'),
    moment = require('moment'),
    user = mongoose.model('Users'),
    SmsLog = mongoose.model('SmsLog'),
    hash = require('../../../../libraries/bcrypt'),
    i18n = require('i18n'),
    sendMail = require('../../../../libraries/worker-farm/email'),
    signUpTemp = require('../../../../email/signUp'),
    { check, validationResult } = require('express-validator'),
    randomize = require('randomatic'),
    validator = [
        check('email').isEmail(),
        check('refferCode').isString(),
        check('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
        check('countryCode').isString(),
        check('phone').isString(),
        check('loginType').isInt(),
        check('facebookId').isString(),
    ]

let userId;
const signUp = async (req, res) => {
    try {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${location}[${param}]: ${msg}`;
        };

        const errors = validationResult(req).formatWith(errorFormatter)

        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array() })
        }

        if (req.body.email == "" && req.body.phone == "") {
            res.status(408)
            return res.send({ message: i18n.__('user')["userRegistered"]["408"] })
        }

        if (req.body.email && req.body.email != "") {
            const isRegistered = await checkEmail(req.body.email);

            if (isRegistered) {
                res.status(409)
                return res.send({ message: "Email already registered" })
            }
        }

        if (req.body.phone && req.body.phone != "") {
            const isRegisteredPhone = await checkPhone(req.body.phone);

            if (isRegisteredPhone) {
                res.status(410)
                return res.send({ message: "Phone number already in use"})
            }
        }

        const password = await hashpassword(req.body.password)
        req.body.password = password
        req.body.email = req.body.email.toLowerCase()
        await saveToDb({ ...req.body })

        if (req.body.refferCode) {
            checkReferalCode({ ...req.body })
        }

        sendEmail(req.body.email.toLowerCase())
        sendVerifyCode({phone:req.body.phone,countryCode:'+91',email:req.body.email})
        res.status(200)

        return res.send({ message: "Registered successfully",userId: userId})

    } catch (error) {
        return res.send({ message: error.message }).status(error.code)
    }
}

const checkEmail = (email) => new Promise((resolve, reject) => {
    // check user email is already present
    user.findOne({ email: email }, (err, res) => {
        if (err) {
            reject(err)
        } else if (res == null) {
            resolve(false)
        } else {
            resolve(true)
        }
    })
})

const checkPhone = (phone) => new Promise((resolve, reject) => {
    // check user phone is already present
    user.findOne({ "phone.phone": phone }, (err, res) => {
        if (err) {
            reject(err)
        } else if (res == null) {
            resolve(false)
        } else {
            resolve(true)
        }
    })
})

const hashpassword = (password) => new Promise((resolve, reject) => {
    // hash password
    hash.hashPassword(password, (err, response) => {
        if (err) {
            reject(err)
        } else {
            resolve(response)
        }
    })
})

const saveToDb = (data) => new Promise((resolve, reject) => {
    // hash password
    const userModel = new user({
        email: data.email,
        password: data.password,
        fullName: '',
        refCode: randomize('AAAA0'),
        userName: randomize('aaaaaaaaaa'),
        phone: [{
            countryCode: data.countryCode,
            phone: data.phone ? data.phone : "",
            isCurrentlyActive: true,
        }],
        wallet: {
            balance: 0,
            bonus: 0.5
        },
        totalRefers: 0,
        facebookId: data.facebookId || 0,
        status : 1
    })

    userModel.save((err, res) => {
        if (err)
            reject(err)
        else {
            userId = res._id;

            resolve(true)
        }

    })
})


const sendEmail = (email) => {
    sendMail({
        to: 'vishalvdutta@gmail.com',
        ...signUpTemp(email)
    });
}

const sendVerifyCode = (phone,email) => {
    const code = randomize('AAAA0');
    const time = moment().unix();
    
    user.updateOne({_id: userId},{$set:{
        OTP:{
            time,
            code:1111,
            active: true
        }
    }}).then(response => {
        SmsLog.updateOne({_id:new mongoose.mongo.ObjectId},{
            to: phone.phone,
            countryCode: phone.countryCode,
            code: 1111 // randomize('0000')
        },{upsert:true}).then(response => {}).catch()
    }).catch()
}

const checkReferalCode = (data) => {
    return new Promise((resolve, reject) => {
        if (data.refferCode && data.refferCode != "" && data.refferCode != undefined) {
            user.findOne({ $or: [{ refCode: data.refferCode }, { refCode: data.refferCode }] }, (err, referrer) => {
                if (err) {
                    return reject(dbErrResponse);
                } else if (referrer === null) {
                    return resolve({ message:"Refferal code is invalid" })
                } else {
                    let referralData = {
                        id: referrer._id,
                        userId: userId,
                        registeredOn: moment().unix(),
                        firstname: data.firstName,
                        lastName: data.lastName || "",
                        email: (data.email).toLowerCase() || "",
                        countryCode: data.countryCode || "",
                        phone: data.mobile || "",
                    }
                    updateReferals(referralData, (err, res) => {
                        updateProfile(userId, {
                            referrUser: {
                                userId: (referrer._id).toString(),
                                firstname: referrer.firstName || "",
                                lastName: referrer.lastName || "",
                                email: (referrer.email).toLowerCase() || "",
                                countryCode: referrer.phone[0].countryCode || "",
                                phone: referrer.phone[0].phone || "",
                                claimCount: 0
                            }
                        }, (err, res) => {
                            return resolve(data);
                        })
                    })
                }
            });
        } else {
            return resolve(data);
        }
    });
}

const updateReferals = (referralCode, callBack) => {
    user.updateOne({ _id: new mongoose.mongo.ObjectId(referralCode.id) }, {
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
            "totalRefers": 1
        }
    }).then(response => {
        callBack(null, response);
    }).catch(err => {
        callBack(err);
    })

}

const updateProfile = (userId, data, callBack) => {
    user.updateOne({ _id: new mongoose.mongo.ObjectId(userId) }, {
        $set: data
    }).then(response => {
        callBack(null, response);
    }).catch(err => {
        callBack(err);
    })

}

module.exports = {
    signUp,
    validator
}

/**
 *
    winnings:
    wallet: {
        balance:
        bonus:
    },


 */