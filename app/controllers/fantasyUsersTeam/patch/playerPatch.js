const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const updateWorker = require('../../../workfarm/index');

const patch = async (req, res) => {
 
    var obj = {
        players: req.body.players
    };

    let prevTeam = await FantasyUsersTeam.findOne({_id: new mongoose.mongo.ObjectId(req.params.teamId)})
    .then(resp => resp)

    

    await FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId(req.params.teamId)}, 
        {$set:obj}
    ).then(response => {
        countUpdate(req.body,prevTeam,2).then().catch();
        res.status(200).json(response);
    })
}

async function countUpdate(data,prev){
         
    let Players = await FantasyPlayer.findOne({matchId:data.matchId}).lean().exec().then(response => response).catch(err => console.log(err))  
    
    let teamplayers = data.players;
    let prevplayers = prev.players;

    let arr = [];
     

    Object.entries(prevplayers).forEach(([key,value]) => {

        let cond = {
            [`players.${value.teamId}.${value.position.name}.${key}.selected`]:-1,
            [`players.${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
            [`players.${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
        }

        if(value.captain === true){
            cond = {
                [`players.${value.teamId}.${value.position.name}.${key}.selected`]:-1,
                [`players.${value.teamId}.${value.position.name}.${key}.captainCount`]: -1,
                [`players.${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
            }
        }

        if(value.viceCaptain === true){
            cond = {
                [`players.${value.teamId}.${value.position.name}.${key}.selected`]:-1,
                [`players.${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
                [`players.${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: -1
            }
        }

        arr.push(new Promise((resolve,reject) => (FantasyPlayer.updateOne({_id:mongoose.mongo.ObjectID(Players._id)},{
            $inc:cond,
         })).then(resp => resolve(true)).catch(err => reject(false))))
    });

    await Promise.all(arr).then(resp => {
        console.log(resp); 
        }).catch(err => {console.log(err);})

    let arr2 = [];


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

        arr2.push(new Promise((resolve,reject) => (FantasyPlayer.updateOne({_id:mongoose.mongo.ObjectID(Players._id)},{
            $inc:cond,
         })).then(resp =>{  resolve(true)}).catch(err => reject(false))))
    });
    
    await Promise.all(arr2).then(resp => {
        console.log(resp); 
 
 }).catch(err => {console.log(err);})
    
    
    
    // ContestType3

}

module.exports = patch