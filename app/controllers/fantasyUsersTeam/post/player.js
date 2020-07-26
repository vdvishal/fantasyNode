const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const Users = mongoose.model('Users');

const post = async (req, res) => {
    console.log(req.body);
    let user = await Users.findById(req.user.id).select('userName').lean().exec().then(response => response)

    await FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId()}, 
        {$set:{
            userId: mongoose.mongo.ObjectId(req.user.id),
            teamName:  user.userName,
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