const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const email =  new Schema({},{ strict: false,timestamps:true })

mongoose.model('SmsLog', email);