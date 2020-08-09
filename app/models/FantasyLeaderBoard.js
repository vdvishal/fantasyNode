
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const FantasyLeaderBoard = new Schema({

}, { strict: false })




mongoose.model('FantasyLeaderBoard', FantasyLeaderBoard);
