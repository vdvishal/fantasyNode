const mongoose = require('mongoose');
require('../models/contest');
require('../models/CustomContest');
require('../models/fantasyContest');
require('../models/fantasyJoinedContest');
require('../models/matches');
require('../models/fantasyPlayer');
require('../models/appStats');


mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

const match = mongoose.model('Matches');
const axios = require('axios')

let FantasyPlayer = mongoose.model('FantasyPlayer');

let Contest = mongoose.model('Contest');
let CustomContest = mongoose.model('CustomContest');
let FantasyContest = mongoose.model('FantasyContest');

let FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
let AppStats = mongoose.model('AppStats');


module.exports = async (lineUpArr, matchId) => {
    console.log('matchId: lineup', matchId);
    let updatArr = [];
    try {
 
    let matchDetail = await match.findOne({ id: parseInt(matchId) }).select('-balls').lean().exec().then(response => response)
    
 
    lineUpArr.forEach(player => {
        updatArr.push(new Promise((resolve, reject) => {
            FantasyPlayer.updateOne({
                "matchId": parseInt(matchId),
                [`players.${(player.lineup.team_id).toString()}.${(player.id).toString()}`]: { $exists: true }
            },{
                $set: {
                    [`players.${(player.lineup.team_id).toString()}.${(player.id).toString()}.isPlaying`]: true
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
        ...updatedFantasyPlayer.players[0].v, ...updatedFantasyPlayer.players[1].v
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
                        notPlaying1:value.id
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
                        notPlaying2:value.id
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

        if (value.isPlaying === true) {
            let condition = {
                "matchId": parseInt(matchId),
                [`players.${value.id}`]: { $exists: true },
                contestType: 3
            }

            updateContest.push(new Promise((resolve, reject) => {
                Contest.updateMany(condition, {
                    $set: {
                        status: "live",
                        notPlaying:00000
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
                        status: "live",
                        notPlaying:00000
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))
             

            updateContest.push(new Promise((resolve, reject) => {
                Contest.updateMany(condition2, {
                    $set: {
                        status: "live",
                        notPlaying:00000
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
                        status: "live",
                        notPlaying:00000
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
                        status: "live",
                        notPlaying:00000
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
                        status: "live",
                        notPlaying:00000
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
                        status: "live",
                        notPlaying:00000
                    }
                }).then(response => resolve("Updated")).catch(err => reject(err))
            }))
            
        }

    })

    await Promise.all(updateContest).then(response => ("Updated")) 

     // FANTASY CONTEST
    await FantasyContest.find({
        isFull:false,
        matchId:parseInt(matchId),
    })
    .lean()
    .cursor()
    .eachAsync(async function (doc, i) {
 
 
        await refundUser(doc).then(response => response)
 
    }).then(response => ("Updated")) 

    await match.updateOne({ id: parseInt(matchId) }, {
        $set: {
            isLineupUpdated: true
        }
    }).then(response => ("Updated")).catch(err => console.log(err))
}
    catch (error) {
        console.log('===============',error)
    }

}



const refundUser = (contest) => new Promise((resolve,reject) => {
 

    if(contest.totalJoined === 0){
        FantasyContest.updateOne({
            _id:mongoose.mongo.ObjectID(contest._id.toString())
        },{
            status:"Discarded"
        }).then(response => resolve(true)).catch(err => reject(err))
    }else if(contest.totalSpots === 2 || contest.totalSpots === 3 || (contest.totalSpots === 4 && contest.totalJoined < 3)){
        FantasyContest.updateOne({
            _id:mongoose.mongo.ObjectID(contest._id.toString())
        },{
            status:"Discarded"
        }).then(response => resolve(true)).catch(err => reject(err))
    }else{
        resolve(true)
    }

})