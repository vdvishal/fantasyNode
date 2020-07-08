const mongoose = require('mongoose');
const JoinThirdContest = mongoose.model('MatchUpContest');

/**
 * 
 * @param {*} req  
 * matchId
 * @param {*} res 
 */


const get = (req, res) => {
    JoinThirdContest.find({ matchId: req.query.matchId }).exec().then(response => res.status(200).json({ data: response }))
}

module.exports = get