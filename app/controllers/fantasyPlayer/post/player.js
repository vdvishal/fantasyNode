const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const ContestTemplate = require('../../../Templates/contest')
const Contest = mongoose.model('FantasyContest');
const TeamImage = mongoose.model('TeamImage');

// const redis = require('../../../library/redis/redis');
const moment = require('moment')

const post = async (req, res) => {
    console.log(req.body);

    let image1 = await TeamImage.findOne({
        teamId:req.body.localTeam
    }).then(response => response ? response.link : '')

    let image2 = await TeamImage.findOne({
        teamId:req.body.visitorTeam
    }).then(response => response ? response.link : '')

    Object.entries(req.body.players[req.body.localTeam]).forEach(([key, value]) => {
        req.body.players[req.body.localTeam.toString()][key].teamDetails.image_path = image1
    })

    Object.entries(req.body.players[req.body.visitorTeam]).forEach(([key, value]) => {
        req.body.players[req.body.visitorTeam.toString()][key].teamDetails.image_path = image2
    })

    await FantasyPlayer.updateOne({matchId:req.body.matchId},req.body,{upsert:true}).then(response => {
        // createContest(req.body.matchId)
    
        res.status(200).json(response);
    })


}   


const createContest = (match) => new Promise((resolve,reject) => {
    const array = [
        // ...ContestTemplate.headTohead,
        // ...ContestTemplate.threeWay,
        // ...ContestTemplate.fourWayType,
        // ...ContestTemplate.fourWay,
        //  ...ContestTemplate.winnerTen,
        ...ContestTemplate.singleType1,
        ...ContestTemplate.singleType2,
        ...ContestTemplate.singleType3,
        ...ContestTemplate.singleType4,
        ...ContestTemplate.unlimitedContest
    ]
    
    array.forEach((contestObj,index) => {
        const contest = new Contest({
            contestName: contestObj.contestName,
            totalSpots: contestObj.totalSpots,
            isFull: false,
            limit: contestObj.limit,
            type:contestObj.type,
            entryFee: contestObj.entryFee,
            prizePool: contestObj.prizePool,
            totalWinners: contestObj.totalWinners.toString(),
            matchId: match,
            totalJoined: 0,
            prize:  contestObj.prize,
            prizeBreakUp: contestObj.prizeBreakUp,
            users: [],
            leaderBoard: []
        })

        contest.save((err,res) => {
            if(err){
                console.log("error.message2");

                reject(err)
            }else{
                if(index === array.length - 1){
                    resolve(true)
                }
            }
        })
    });
})

module.exports = post