const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const webhook =  new Schema({},{ strict: false,timestamps:true })

mongoose.model('Webhook', webhook);