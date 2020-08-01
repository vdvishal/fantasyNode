

const mongoose = require('mongoose');
const FantasyContest = mongoose.model('FantasyContest');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');

const AppStats = mongoose.model('AppStats');
const _ = require('lodash');

/**
 * 
 * @param {*} req
 *               playerId:req.params.playerId,matchId:req.params.matchId             
 *  
 * @param {*} res 
 */


const getLeaderBoard = async (req, res) => {
  
     
    let leaderBoard = await FantasyJoinedUsers.aggregate([
        {
            $match:{
                contestId: mongoose.mongo.ObjectID(req.params.contestId),
            }
        },
        {
            $lookup:{
                from:"fantasyusersteams",
                localField: 'teamId',
                foreignField: '_id',
                as: 'teamDetails'
            }
        },
        {
            $lookup:{
                from:"users",
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $project:{
                teamDetails:{$arrayElemAt : ["$teamDetails",0]},
                playerDetails:{$arrayElemAt : ["$teamDetails",0]},
                userDetails:{$arrayElemAt : ["$userDetails",0]},
            }
        },
        {
            $project:{
                teamDetails:{
                    teamName:1,
                    _id:1
                },
                userDetails: {
                    userName:1,
                    profilePic:1
                },
                playerDetails: "$playerDetails.players",
            }
        },
        {
            $project:{
                teamDetails:1,
                userDetails:1,
                playerDetails: {$objectToArray : "$playerDetails"},
            }
        },
        {
            $project:{
                teamDetails:1,
                userDetails:1,
                points: { $sum: "$playerDetails.v.points" },
            }
        },
        {
            $sort:{
                "points" : -1
            }
        },
        { 
            $skip : req.query.page*200 
        },
        {
            $limit:200
        },
    ])
    .then(response => response)
    .catch(err => err)
     
    res.status(200).json({leaderBoard})

}

module.exports = getLeaderBoard