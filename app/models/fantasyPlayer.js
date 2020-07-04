  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const FantasyPlayer =  new Schema({
  
},{strict:false})



mongoose.model('FantasyPlayer', FantasyPlayer);
