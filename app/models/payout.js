const moment = require('moment')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const payout =  new Schema({
    userId: {
        type:mongoose.Types.ObjectId
    },
    created:{
        type:Date,default: Date.now()
    },
    amount:Number,
    paidOut: {
        type:Boolean,default:false
    },
    paidOutDate:{
        type:Date
    }, 
},{ strict: false,timestamps:true })

mongoose.model('Payout', payout);