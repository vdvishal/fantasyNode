const mongoose = require('mongoose');
require('../models/contest');
require('../models/CustomContest');

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

const match = mongoose.model('Matches');
const axios = require('axios')

let FantasyPlayer = mongoose.model('FantasyPlayer');

let Contest = mongoose.model('Contest');
let CustomContest = mongoose.model('CustomContest');


module.exports = async (lineUpArr, matchId) => {
    let updatArr = [];
    try {
        
 
    // let matchDetail = await match.findOne({ id: parseInt(matchId) }).select('-balls').lean().exec().then(response => response)


    lineUpArr.forEach(player => {
        updatArr.push(new Promise((resolve, reject) => {
            FantasyPlayer.updateOne({
                "matchId": parseInt(matchId),
                [`players.${(player.lineup.team_id).toString()}.${player.position.name}.${(player.id).toString()}`]: { $exists: true }
            },{
                $set: {
                    [`players.${(player.lineup.team_id).toString()}.${player.position.name}.${(player.id).toString()}.isPlaying`]: true
                }
            }).then(response => resolve(response)).catch(err => reject(err))
        }))


    });


    let response = await Promise.all(updatArr).then(response => response).catch(err => console.log(err))

    if (response === "err") {
        return
    }

    // if(matchDetail.isLineupUpdated === true){
    //     console.log(matchDetail.isLineupUpdated);
    //     return {message:true}
    // }else{
         
    await match.updateOne({ id: parseInt(matchId) }, {
        $set: {
            isLineupUpdated: true
        }
    }).then(response => ("Updated")).catch(err => console.log(err))
    // }

    let updatedFantasyPlayer = await FantasyPlayer.aggregate([
        {
            '$match': {
                'matchId': matchId
            }
        }, {
            '$project': {
                'matchId': 1,
                'players': {
                    '$objectToArray': '$players'
                }
            }
        }
    ]).then(response => response)
        .catch(err => err)
     updatedFantasyPlayer = updatedFantasyPlayer[0]
    let allPlayer = {
        ...updatedFantasyPlayer.players[0].v.Batsman, ...updatedFantasyPlayer.players[1].v.Batsman,
        ...updatedFantasyPlayer.players[0].v.Bowler, ...updatedFantasyPlayer.players[1].v.Bowler,
        ...updatedFantasyPlayer.players[0].v.Wicketkeeper, ...updatedFantasyPlayer.players[1].v.Wicketkeeper,
        ...updatedFantasyPlayer.players[0].v.Allrounder, ...updatedFantasyPlayer.players[1].v.Allrounder
    }

    let updateContest = [];

    Object.entries(allPlayer).forEach(([key, value]) => {
         
        if (value.isPlaying !== true ||  value.isPlaying === undefined) {
            let condition = {
                "matchId": parseInt(matchId),
                [`players.${value.id}`]: { $exists: true },
                contestType: 3
            }

            updateContest.push(new Promise((resolve, reject) => {
                Contest.updateMany(condition, {
                    $set: {
                        status: "Discarded",
                        notPlaying:value.id
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))

            let condition2 = {
                "matchId": parseInt(matchId),
                "playerInfo.id": parseInt(value.id),
                contestType: 1
            }

            let condition2a = {
                "matchId": parseInt(matchId),
                "playerInfo.id": parseInt(value.id),
                contestType: 2
            }

            updateContest.push(new Promise((resolve, reject) => {
                Contest.updateMany(condition2a, {
                    $set: {
                        status: "Discarded",
                        notPlaying:value.id
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))
             

            updateContest.push(new Promise((resolve, reject) => {
                Contest.updateMany(condition2, {
                    $set: {
                        status: "Discarded",
                        notPlaying:value.id
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))

            let condition3 = {
                "matchId": parseInt(matchId),
                playerId: parseInt(value.id),
                contestType: 5
            }

            
            updateContest.push(new Promise((resolve, reject) => {
                CustomContest.updateMany(condition3, {
                    $set: {
                        status: "Discarded",
                        notPlaying:value.id
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))

            let condition4 = {
                "matchId": parseInt(matchId),
                player1: parseInt(value.id),
                contestType: 6
            }

            updateContest.push(new Promise((resolve, reject) => {
                CustomContest.updateMany(condition4, {
                    $set: {
                        status: "Discarded",
                        notPlaying:value.id
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))

            let condition5 = {
                "matchId": parseInt(matchId),
                player2: parseInt(value.id),
                contestType: 6
            }

            updateContest.push(new Promise((resolve, reject) => {
                CustomContest.updateMany(condition5, {
                    $set: {
                        status: "Discarded",
                        notPlaying:value.id
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))

            let condition7 = {
                "matchId": parseInt(matchId),
                open:true
            }

            updateContest.push(new Promise((resolve, reject) => {
                CustomContest.updateMany(condition7, {
                    $set: {
                        status: "Discarded",
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))
            
        }

    })

    let response2 = await Promise.all(updateContest).then(response => ("Updated")).catch(err => ("err"))

}
    catch (error) {
        console.log('===============',error)
    }

}   