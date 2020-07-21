const mongoose = require('mongoose');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');

const match = mongoose.model('Matches');
const moment = require('moment')

const patch = async (req, res) => {
    console.log(req.body);
    
    await match.findOne({id:parseInt(req.body.matchId)}).lean().then(response => {
 
        if(moment(response.starting_at).unix() < moment().unix() ){
            return res.status(202).json({message:"Match has already begun."})
        }
        console.log(moment(response.starting_at).unix());
        console.log(moment().unix());

    })

    await FantasyJoinedUsers.updateOne({_id: mongoose.mongo.ObjectID(req.body.prevTeam)},{
        $set:{
            teamId: mongoose.mongo.ObjectID(req.body.teamId)
        }
    }).then(response => {
        return res.status(202).json({message:"Team updated"})
    })
}

module.exports = patch