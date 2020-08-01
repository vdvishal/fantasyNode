'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Withdraw =  new Schema({
},{ strict: false,timestamps:true })



mongoose.model('Withdraw', Withdraw);
