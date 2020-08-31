'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Contest =  new Schema({
  contestName: String,
  contestInfo: String,
  contestType: Number, // 1: more or less, 2: VS , 3: Fantasy points
  sport: Number,//1: Cricket,2: football
  type: Number, // 1: runs, 2: wickets, 3: goal, 4:fantasy points
  typeName: String,
  value: Number,
  open: {type:Boolean,default:true},
  matchId: Number,
  playerId: String,
  playerDetail: Object,   
  info: Object,
  handicap: {type:mongoose.Types.ObjectId},
  amount: Number,
  totalAmount:Number,
  status:String,
  player1:Number,
  player2:Number,
  player1Detail: Object,
  player2Detail: Object,
  users:{
    player1:{type:mongoose.Types.ObjectId},
    player2:{type:mongoose.Types.ObjectId},
  },
  userInfo:{
    player1:Object,
    player2:Object,
  },
},{ timestamps:true })



mongoose.model('CustomContest', Contest);
