'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const appStats =  new Schema({
    deposits: Number,
    payout: Number,
    profit: Number,
    wagered: Number
},{ strict: false,timestamps:true })



mongoose.model('AppStats', appStats);
