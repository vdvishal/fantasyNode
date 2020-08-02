const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const Users = mongoose.model('Users');
const updateWorker = require('../../../workfarm/index');

const post = async (req, res) => {
    console.log(Object.entries(req.body.players).length);
    
     if(Object.entries(req.body.players).length !== 11){
        return res.status(202).json({message:"11 players must be selected."})
    }
    let user = await Users.findById(req.user.id).select('userName').lean().exec().then(response => response)

    let count = await FantasyUsersTeam.count({userId: mongoose.mongo.ObjectId(req.user.id),matchId: parseInt(req.body.matchId)})
            .then(resp => resp)
    updateWorker.teamUpdate(req.body,null,1);

    await FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId()}, 
        {$set:{
            userId: mongoose.mongo.ObjectId(req.user.id),
            teamName:  user.userName,
            matchId: parseInt(req.body.matchId),
            players: req.body.players,
            serialNumber:count + 1
        }
    },{upsert:true}
    ).then(response => {
        res.status(200).json({message:"Team Added"});
    })
}


module.exports = post