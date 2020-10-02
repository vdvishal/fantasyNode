const getUpcoming = require('./getUpcoming')
const getByUserId = require('./getByUserId')
const getUpComingMatchByMonth = require('./getUpComingMatchByMonth')
const getDetails = require('./getDetails')
const completed = require('./completed')


module.exports = {
    getUpcoming,
    completed,
    getUpComingMatchByMonth,
    getDetails,
    getByUserId
}