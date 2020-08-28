  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const user =  new Schema({
    email: String,
    password: String,
    fullName: String,
    userName: String,
    paymentId: String,
    profilePic:String,
    refCode:String,
    refLink: String,
    verifiedKYC: { type: Boolean, default: false },
    activated: { type: Boolean, default: false },
    wallet: Object,
    OTP: Object,
    blacklist: Array,
    banned: {type:Boolean,default:false},
    phone:Object,
    referrals:Array,
    totalRefers:Intl,
    referrUser:Object,
    googleId: String, 
    facebookId: String,
    status:Intl,
    refferCode: String,
    lastOnline: {type:Date,default:moment.now()},
    KYC:{}
},{ strict: false,timestamps:true })

mongoose.model('Users', user);
