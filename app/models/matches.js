  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const user =  new Schema({
    name: String,
    teams: Object,
    start_date:Object,
    status:String,
    isOnsite:Boolean,
},{ strict: false,timestamps:true })

mongoose.model('Matches', user);
