
'use strict'
/**
 * Module Dependencies
 */
const moment = require('moment')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const fantasyUsersTeam = new Schema({

}, { strict: false })



mongoose.model('FantasyUsersTeam', fantasyUsersTeam);

// {
//     user:
//     match:
//     players: {
//         1: {
//             point: 10
//             vc: false
//             caption: true
//         },
//         2: {
//             point: 8
//             vc: false
//             caption: true
//         },
//     }

// },
// {
//     user:
//     match:
//     players: {
//         1: {
//             point: 10
//             vc: false
//             caption: true
//         },
//         2: {
//             point: 10
//             vc: false
//             caption: true
//         },
//     }

// }


