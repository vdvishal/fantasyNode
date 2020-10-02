'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Blacklist =  new Schema({
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' },
      },
},{ strict: false,timestamps:true, })



mongoose.model('Blacklist', Blacklist);
