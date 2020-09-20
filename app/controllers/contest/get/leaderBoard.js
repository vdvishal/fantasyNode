

const mongoose = require('mongoose');
const FantasyContest = mongoose.model('FantasyContest');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
const FantasyLeaderBoard = mongoose.model('FantasyLeaderBoard');

const _ = require('lodash');

/**
 * 
 * @param {*} req
 *               playerId:req.params.playerId,matchId:req.params.matchId             
 *  
 * @param {*} res 
 */


const getLeaderBoard = async (req, res) => {
  
    try {
        let leaderBoard = await FantasyLeaderBoard.aggregate([
            {
                $match:{
                    contestId: mongoose.mongo.ObjectID(req.params.contestId),
                }
            },
            {
                $project:{
                    leaderLength: {$size: "$leader"},
                    leader: { $slice: [ "$leader", (parseInt(req.query.page) - 1)*10, 10 ] }
                }
            }
        ]).then(response => response)
        
        
        
        let data = leaderBoard.length > 0 ? leaderBoard[0] : [];

        if(data.leader === undefined || (data.leader && data.leader.length === 0)){
            FantasyJoinedUsers.aggregate([
                {
                    $match:{
                        contestId: mongoose.mongo.ObjectID(req.params.contestId),
                    }
                },
                { 
                    $skip : parseInt(req.query.page - 1)*10 
                },
                {
                    $limit:10
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
                        from:"fantasycontests",
                        localField: 'contestId',
                        foreignField: '_id',
                        as: 'contestDetails'
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
                        contestDetails:{$arrayElemAt : ["$contestDetails",0]},
                        teamDetails:{$arrayElemAt : ["$teamDetails",0]},
                         userDetails:{$arrayElemAt : ["$userDetails",0]},
                    }
                },
                {
                    $project:{
                        teamDetails:{
                            teamName:1,
                            _id:1,
                            serialNumber:1
                        },
                        userDetails: {
                            userName:1,
                            profilePic:1
                        },
                        contestDetails:{
                            totalJoined:1
                        }
                     }
                },
                {
                    $project:{
                        users:[
                            {
                                teamDetails:"$teamDetails",
                                userDetails:"$userDetails"
                            }
                        ],
                        contestDetails:1
                     }
                },
            ]).then(response => {
                 data = {
                    leader: response,
                    leaderLength: response[0].contestDetails.totalJoined
                }
                return res.status(200).json({data:data.leader,size:data.leaderLength})
            })
            return

        }
         
        res.status(200).json({data:data.leader,size:data.leaderLength})
    } catch (error) {
        
        res.status(502).json(error)

    }
     


}

module.exports = getLeaderBoard



/**
await FantasyJoinedUsers.aggregate([
        {
            $match:{
                contestId: mongoose.mongo.ObjectID(req.params.contestId),
                userId: {$ne: mongoose.mongo.ObjectID(req.user.id)}
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
                    _id:1,
                    serialNumber:1
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


 */