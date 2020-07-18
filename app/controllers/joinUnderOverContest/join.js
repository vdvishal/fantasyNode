const mongoose = require('mongoose');
const UnderOverContest = mongoose.model('UnderOverContest');

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

    const contest = new UnderOverContest({userId:req.user.id,...dt})

    contest.save().then(response => res.status(200).json(response)).catch()

}


module.exports = post