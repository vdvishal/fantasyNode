const mongoose = require('mongoose');
const MatchUpContest = mongoose.model('MatchUpContest');

/**
 * 
 * @payload {*} req  
    matchId -  ""
    selectedPlayers - [{}]
 * @payload {*} res 
 */

const post = (req, res) => {
    console.log(req.body);
    
    const contest = new MatchUpContest(req.body)

    contest.save().then(response => res.status(200).json(response)).catch()

}


module.exports = post