
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const fantasyJoinedContest = new Schema({

}, { strict: false })




mongoose.model('FantasyJoinedContest', fantasyJoinedContest);

// {
//     userId:
//     matchID:
//     teamID:
//     contestID:
// }

