
  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const MatchUpContest =  new Schema({
    matchId:Number,
    amount:Number,
    selectedTeam:Object
},{strict:false})



mongoose.model('MatchUpContest', MatchUpContest);
