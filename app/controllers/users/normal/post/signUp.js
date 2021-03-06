'use strict'
const mongoose = require('mongoose'),
    moment = require('moment'),
    user = mongoose.model('Users'),
    SmsLog = mongoose.model('SmsLog'),
    hash = require('../../../../libraries/bcrypt'),
    i18n = require('i18n'),
    sendMail = require('../../../../libraries/worker-farm/email'),
    signUpTemp = require('../../../../email/signUp'),
    sendSms = require('../../../../libraries/twilio'),
    { check, validationResult } = require('express-validator'),
    randomize = require('randomatic'),

    validator = [
        check('email').isEmail().notEmpty(),
        check('password').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
        check('countryCode').isString().notEmpty(),
        check('phone').isString().notEmpty(),
        check('loginType').isInt(),
        check('refferCode').isString().optional(),
     ]

    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();


let userId;
const signUp = async (req, res) => {
 
    try {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${param}: ${msg}`;
        };
 
        const errors = validationResult(req).formatWith(errorFormatter)

        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array() })
        }
        const phone = phoneUtil.parseAndKeepRawInput(req.body.phone, 'IN');

         
        if (!phoneUtil.isValidNumber(phone)) {
            return res.status(400).json({ message: "Phone number is not valid" })
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



        sendEmail(req.body.email.toLowerCase())
        sendVerifyCode({phone:req.body.phone,countryCode:'+91',email:req.body.email})
        res.status(200)

        return res.send({ message: "Registered successfully",userId: userId})

    } catch (error) {
        return res.send({ message: error.message }).status(502)
    }
}

const checkEmail = (email) => new Promise((resolve, reject) => {
    // check user email is already present
    user.findOne({ email: email,activated:true}, (err, res) => {
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
    user.findOne({ "phone.phone": phone,activated:true}, (err, res) => {
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
    let refCode = randomize('AAAA0');
    const userModel = new user({
        email: data.email,
        password: data.password,
        fullName: '',
        refCode: refCode,
        refLink: `https://fantasyjutsu.com/register?ref=${refCode}`,
        refferCode:data.refferCode,
        userName: data.email.split("@")[0],
        phone: {
            countryCode: data.countryCode,
            phone: data.phone ? data.phone : "",
            isCurrentlyActive: true,
        },
        wallet: {
            balance: 0,
            bonus: 0
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
    // sendMail({
    //     to: 'vishalvdutta@gmail.com',
    //     ...signUpTemp(email)
    // });
}

const sendVerifyCode = (phone,email) => {
    const code = randomize('0000');
    const time = moment().unix();
    
    user.updateOne({_id: userId},{$set:{
        OTP:{
            time,
            code:code,
            active: true
        }
    }}).then(response => {
        sendSms(phone.countryCode+phone.phone,`Your verification code: ${code}`);
        SmsLog.updateOne({_id:new mongoose.mongo.ObjectId},{
            to: phone.phone,
            countryCode: phone.countryCode,
            code: code
        },{upsert:true}).then(response => {}).catch()
    }).catch()
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