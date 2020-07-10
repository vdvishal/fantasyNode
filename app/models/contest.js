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
  limit: Number, // max: 2
  open: {type:Boolean,default:true},
  matchId: Number,
  playerId: String,
  playerInfo: Object,
  playerIds: [
    {
      playerId: String,
      playerName: String,
      pic: String,
      team: String
    }
  ],
  teamOne: [
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
 
teamTwo: [
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
   
teamThree: [
 
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
   
teamFour: [
 
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
 
teamFive: [
 
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
  
teamSix: [
 
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
  
teamSeven: [
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
   
teamEight:[
    {
      userId: {
        type: mongoose.Types.ObjectId
      },
      amount: Number
    }
  ],
   
  totalAmount: Object,
  info: Object,
  finalTotal: Number,
  profit:Number,
  status:String
},{strict:false})



mongoose.model('Contest', Contest);
