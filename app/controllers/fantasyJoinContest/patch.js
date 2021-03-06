const mongoose = require('mongoose');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');

const matches = mongoose.model('Matches');
const moment = require('moment')

const patch = async (req, res) => {
     
    let match = await matches.findOne({id:parseInt(req.body.matchId)}).lean().then(response => response)

     
    if(moment(match.starting_at).unix() < moment().unix() ){
        return res.status(202).json({message:"Match has already begun."})
    }

    await FantasyJoinedUsers.updateOne({_id: mongoose.mongo.ObjectID(req.body.prevTeam)},{
        $set:{
            teamId: mongoose.mongo.ObjectID(req.body.teamId)
        }
    }).then(response => {
        return res.status(202).json({message:"Team updated"})
    })
}

module.exports = patch