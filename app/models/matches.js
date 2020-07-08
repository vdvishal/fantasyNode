  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const user =  new Schema({
    key: String,
    name: String,
    teams: Object,
    start_date:Object,
    status:String
},{strict:false})

mongoose.model('Matches', user);
