const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const otherUserStats =  new Schema({
    matchId: Array,
    points: Number,
    highestPoints: Number,
    won: Number,
    earned: Number,
    spent: Number,
    contest: Number,
    exPoint: Number
},{ strict: false,timestamps:true })

mongoose.model('OtherUserStats', otherUserStats);