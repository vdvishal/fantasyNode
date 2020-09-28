const mongoose = require('mongoose');
const match = mongoose.model('Matches');

module.exports = (req,res) => {
    console.log('req.body: ', req.body);
    try {
        match.updateOne({
            id:parseInt(req.body.matchId)
            
        },{
            $push:{
                runOut:{
                    "resource" : "runout",
                    "team_id" : parseInt(req.body.teamId),
                    "player_id" :parseInt(req.body.playerId),
                    "runOut":parseInt(req.body.runOut),
                    position:req.body.position
                }
            }        
        }).then(response => res.send({message:"Updated"}))
    } catch (error) {
        res.send({message:error})
    }

} 