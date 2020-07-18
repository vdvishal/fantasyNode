  
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const FantasyPlayer =  new Schema({
  
},{ strict: false,timestamps:true })

FantasyPlayer.virtual('matchDetail',{
  ref: 'Matches',
  localField: 'matchId',
  foreignField: 'id',
})


mongoose.model('FantasyPlayer', FantasyPlayer);
