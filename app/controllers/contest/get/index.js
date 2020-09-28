let get = require('./get')
let getById = require('./getById')
let getUserId = require('./getByUserIdMatchId')
let leaderBoard = require('./leaderBoard')

let matchUps = require('./matchUps')
let getFantasyContest = require('./getFantasyContest')
let getCustom = require('./getCustom')

let getCount = require('./getCount')

module.exports = {
    get,
    getById,
    getUserId,
    matchUps,
    getFantasyContest,
    leaderBoard,
    getCustom,
    
    getCount
}