const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const Users = mongoose.model('Users');
const FantasyPlayer = mongoose.model('FantasyPlayer');

const post = async (req, res) => {
    console.log(Object.entries(req.body.players).length);
    
     if(Object.entries(req.body.players).length !== 11){
        return res.status(202).json({message:"11 players must be selected."})
    }
    let user = await Users.findById(req.user.id).select('userName').lean().exec().then(response => response)

    let count = await FantasyUsersTeam.count({userId: mongoose.mongo.ObjectId(req.user.id),matchId: parseInt(req.body.matchId)})
            .then(resp => resp)

    await FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId()}, 
        {$set:{
            userId: mongoose.mongo.ObjectId(req.user.id),
            teamName: user.userName,
            matchId: parseInt(req.body.matchId),
            players: req.body.players,
            serialNumber:count + 1
        }
    },{upsert:true}
    ).then(response => {
        countPercent(req.body).then().catch();
        res.status(200).json({message:"Team Added"});
    })
}


async function countPercent(data){
         
    let Players = await FantasyPlayer.findOne({matchId:data.matchId}).lean().exec().then(response => response).catch(err => console.log(err))  
    
    let teamplayers = data.players;

    let arr = [];

    Object.entries(teamplayers).forEach(([key,value]) => {
        let cond = {
            [`players.${value.teamId}.${value.position.name}.${key}.selected`]:1,
            [`players.${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
            [`players.${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
        }

        if(value.captain === true){
            cond = {
                [`players.${value.teamId}.${value.position.name}.${key}.selected`]:1,
                [`players.${value.teamId}.${value.position.name}.${key}.captainCount`]: 1,
                [`players.${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
            }
        }

        if(value.viceCaptain === true){
            cond = {
                [`players.${value.teamId}.${value.position.name}.${key}.selected`]:1,
                [`players.${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
                [`players.${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 1
            }
        }

        arr.push(new Promise((resolve,reject) => (FantasyPlayer.updateOne({_id:mongoose.mongo.ObjectID(Players._id)},{
            $inc:cond,
            $set:{totalTeams: Players.totalTeams ? Players.totalTeams + 1 : 1}
        })).then(resp => resolve(true)).catch(err => reject(false))))
    });
    
    await Promise.all(arr).then(resp => {
 
    }).catch(err => {console.log(err);})
    
    

    // ContestType3

}

module.exports = post