'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Appconfigs =  new Schema({
},{ strict: false,timestamps:true })



mongoose.model('Appconfigs', Appconfigs);
