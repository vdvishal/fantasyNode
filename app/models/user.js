  
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
    time:{ type: Date, default: moment.now() },
    verified: { type: Boolean, default: false },
    activated: { type: Boolean, default: false },
    wallet: Object,
    OTP: Object,
    blacklist: Array,
    banned: {type:Boolean,default:false},
    phone:Array,
    referrals:Array,
    totalRefers:Intl,
    referrUser:Object,
    googleId: String, 
    facebookId: String,
    status:Intl,
},{ strict: false,timestamps:true })

mongoose.model('Users', user);
