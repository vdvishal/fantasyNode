const mongoose = require('mongoose');
const match = mongoose.model('Matches');

module.exports = (req,res) => {
    try {
        match.updateOne({
            id:parseInt(req.body.matchId)
        },{
            $push:{
                runOut:{
                    "resource" : "runout",
                    "team_id" : parseInt(req.body.teamId),
                    "player_id" :parseInt(req.body.playerId),
                    "runout":parseInt(req.body.runout)
                }
            }        
        }).then(response => res.send({message:"Updated"}))
    } catch (error) {
        res.send({message:error})
    }

} 