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
    let dt = req.body
    
    Object.entries(dt.selectedTeam).forEach(([key,value]) => {
        dt.selectedTeam[key].contestId = mongoose.mongo.ObjectID(dt.selectedTeam[key].contestId)
    })    
    
    const contest = new MatchUpContest({userId:req.user.id,...req.body})

    contest.save().then(response => res.status(200).json(response)).catch()

}


module.exports = post