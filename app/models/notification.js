const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const notification =  new Schema({},{ strict: false,timestamps:true })

mongoose.model('Notification', notification);