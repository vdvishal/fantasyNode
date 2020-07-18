const mongoose = require('mongoose');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');

/**
 * 
 * @payload {*} req  
    matchId -  ""
    contestId - 
    teamId - 
    userId
 * @payload {*} res 
 */

const post = (req, res) => {    
    const contest = new FantasyJoinedUsers({userId:req.user.id,...req.body})

    contest.save().then(response => res.status(200).json(response)).catch()

}


module.exports = post