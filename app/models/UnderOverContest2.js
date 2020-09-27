
  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UnderOverContest =  new Schema({
    matchId:Number,
    amount:Number,
    userId: {type: mongoose.Types.ObjectId},
    selectedTeam: Object
},{ strict: false,timestamps:true })



mongoose.model('UnderOverContestType2', UnderOverContest);
