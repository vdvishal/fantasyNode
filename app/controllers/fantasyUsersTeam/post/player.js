const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const post = (req, res) => {
    console.log(req.body);
    FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId()}, 
        {$set:{
            userId: mongoose.mongo.ObjectId(req.user.id),
            teamName:  "req.user.username",
            matchId: parseInt(req.body.matchId),
            players: req.body.players
        },
        $inc: {
            serialNumber:1
        },
    },{upsert:true}
    ).then(response => {
        res.status(200).json({message:"Team Added"});
    })
}


module.exports = post