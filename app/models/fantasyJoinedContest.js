
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const FantasyJoinedUsers = new Schema({

},{ strict: false,timestamps:true })




mongoose.model('FantasyJoinedUsers', FantasyJoinedUsers);

// {
//     userId:
//     matchID:
//     teamID:
//     contestID:
// }

