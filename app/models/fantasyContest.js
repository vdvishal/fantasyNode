
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const fantasyJoinedContest = new Schema({
    isFull:Boolean,
    matchId:Number
}, { strict: false,timestamps:true })




mongoose.model('FantasyContest', fantasyJoinedContest);

// {
//     userId:
//     matchID:
//     teamID:
//     contestID:
// }

