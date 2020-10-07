const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const UnderOverContest = mongoose.model('UnderOverContest');
const UnderOverContest2 = mongoose.model('UnderOverContestType2');

const MatchUpContest = mongoose.model('MatchUpContest');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
const Matches = mongoose.model('Matches');

/**
 * 
 * @param {*} req
    userId:req.params.userId,
    matchId:parseInt(req.params.matchId)             
    
    matchId -  ""
    contestId - 
    teamId - 
 * @param {*} res 
 */


const getUserId = async (req, res) => {
    let matchDetail = await Matches.findOne({id:parseInt(req.params.matchId)}).lean().exec().then(response => response)

    let con1  = await UnderOverContest.aggregate([
        {
            $match:{matchId:parseInt(req.params.matchId)}
        },
        {
            $sort:{
                "amount": -1
            }
         },
         {
            $limit:100
         },
        {
            $project:{
                    selectedTeam: { $objectToArray: "$selectedTeam"},
                    amount:1,
                     
                    winner:1,
   
                    payout:{ $objectToArray: "$winner"},
                }
         },
         { "$unwind": "$selectedTeam" },
         {
            $lookup: {
                from: 'contests',
                localField: 'selectedTeam.v.contestId',
                foreignField: '_id',
                as: 'contest'
            }
        },
        {
            $group: {
                _id:"$_id",
                contest: {
                    $addToSet: {$arrayElemAt:["$contest",0]}
                },
                amount: {
                    $addToSet: "$amount"
                },
                selectedTeam: {
                    $push: "$selectedTeam"
                },
                winner:{
                    $addToSet: "$winner"
                },
                payout:{
                    $addToSet: "$payout"
                },
                players:{
                    $addToSet: "$players"
                },
            }
        },
        {
            $project: {
                _id:1,
                contest: 1,
                amount:{$arrayElemAt:["$amount",0]},
                selectedTeam: { $arrayToObject: "$selectedTeam"},
                winner:{$arrayElemAt:["$winner",0]},
                payout:{$arrayElemAt:["$payout",0]},
                players:{$arrayElemAt:["$players",0]},
                
            }
        },
        {
            $project: {
                _id:1,
                contest: 1,
                wonContest:{$filter: {
                    input: "$payout",
                    as: "item",
                    cond: { $eq: [ "$$item.v", 1 ] }
                }},
                inPlayContest:{$filter: {
                    input: "$contest",
                    as: "item",
                    cond: { $eq: [ "$$item.status", "notstarted" ] }
                }},
                amount:1,
                selectedTeam: 1,
                winner:1,
                players:1,
                lostContest:{$filter: {
                    input: "$payout",
                    as: "item",
                    cond: { $eq: [ "$$item.v", 0 ] }
                }},
            }
        },
        {
            $addFields: { status: matchDetail.status }
        }
        ]).exec()
        .then(response => response)

    let con2  = await MatchUpContest.aggregate([
        {
            $match:{matchId:parseInt(req.params.matchId)}
        },
        {
            $limit:100
         },
        {
            $project:{
                selectedTeam:{ $objectToArray: "$selectedTeam"},	
                                    amount:1,
                    winner:1,
                    contest:1,
                    players:1,
                    payout:{ $objectToArray: "$winner"},
                }
         },
         { "$unwind": "$selectedTeam" },
         {
            $lookup: {
                from: 'contests',
                localField: 'selectedTeam.v.contestId',
                foreignField: '_id',
                as: 'contest'
            }
        },
        {
            $group: {
                _id:"$_id",
                contest: {
                    $addToSet: {$arrayElemAt:["$contest",0]}
                },
                amount: {
                    $addToSet: "$amount"
                },
                selectedTeam: {
                    $push: "$selectedTeam"
                },
                winner:{
                    $addToSet: "$winner"
                },
                payout:{
                    $addToSet: "$payout"
                },
                players:{
                    $addToSet: "$players"
                },
            }
        },
        {
            $project: {
                _id:1,
                contest: 1,
                amount:{$arrayElemAt:["$amount",0]},
                selectedTeam: { $arrayToObject: "$selectedTeam"},
                winner:{$arrayElemAt:["$winner",0]},
                payout:{$arrayElemAt:["$payout",0]},
                players:{$arrayElemAt:["$players",0]},
                
            }
        },

        {
            $project: {
                _id:1,
                contest: 1,
                wonContest:{$filter: {
                    input: "$payout",
                    as: "item",
                    cond: { $eq: [ "$$item.v", 1 ] }
                }},
                inPlayContest:{$filter: {
                    input: "$contest",
                    as: "item",
                    cond: { $eq: [ "$$item.status", "notstarted" ] }
                }},
                amount:1,
                selectedTeam:1,
                winner:1,
                payout:1,
                players:1,
                
            }
        },
        {
            $project: {
                _id:1,
                contest: 1,
                players:1,
                amount:1,
                wonContest:1,
                payout:1,
                winner:1,
                lostContest:{$filter: {
                    input: "$payout",
                    as: "item",
                    cond: { $eq: [ "$$item.v", 0 ] }
                }},
                selectedTeam: 1
            }
        },
        {
            $addFields: { status: matchDetail.status }
        }
            ]
        ).exec()
        .then(response => response)

    let con3  = await FantasyJoinedUsers.aggregate([
        {
            $match: {  matchId:parseInt(req.params.matchId)}
        },
        {
            "$limit":100
        },
        {
            $lookup: {
                from: 'fantasyusersteams',
                localField: 'teamId',
                foreignField: '_id',
                as: 'team'
            }
        },
        {
            $project: {
 
                matchId: 1,
                contestId: 1,
                teamId:1,
                userId: 1,
                team: {$arrayElemAt:["$team",0]},
             }
        },
        {
            $group: {
                _id: "$contestId",
                entries: { $push:"$$ROOT"},
            }
        },
        {
            $lookup: {
                from: 'fantasycontests',
                localField: '_id',
                foreignField: '_id',
                as: 'contestDetails'
            }
        },
        {
            $project: {
                entries: 1,
                contestDetails: {$arrayElemAt:["$contestDetails",0]},
             }
        },
        ]).allowDiskUse(true).exec()
        .then(response => response)

        let con4  = await Contest.find({
            matchId: parseInt(req.params.matchId)
        }).limit(100).sort({amount:-1}).then(response => response)

        let con5 = await UnderOverContest2.aggregate([
            {
                $match: { matchId: parseInt(req.params.matchId) }
            },
            {
                $sort: {
                    "amount": -1
                }
            },
            {
                $limit:100
             },
            {
                $project: {
                    selectedTeam: { $objectToArray: "$selectedTeam" },
                    amount: 1,
    
                    winner: 1,
    
                    payout: { $objectToArray: "$winner" },
                }
            },
            { "$unwind": "$selectedTeam" },
            {
                $lookup: {
                    from: 'contests',
                    localField: 'selectedTeam.v.contestId',
                    foreignField: '_id',
                    as: 'contest'
                }
            },
            {
                $group: {
                    _id: "$_id",
                    contest: {
                        $addToSet: { $arrayElemAt: ["$contest", 0] }
                    },
                    amount: {
                        $addToSet: "$amount"
                    },
                    selectedTeam: {
                        $push: "$selectedTeam"
                    },
                    winner: {
                        $addToSet: "$winner"
                    },
                    payout: {
                        $addToSet: "$payout"
                    },
                    players: {
                        $addToSet: "$players"
                    },
                }
            },
            {
                $project: {
                    _id: 1,
                    contest: 1,
                    amount: { $arrayElemAt: ["$amount", 0] },
                    selectedTeam: { $arrayToObject: "$selectedTeam" },
                    winner: { $arrayElemAt: ["$winner", 0] },
                    payout: { $arrayElemAt: ["$payout", 0] },
                    players: { $arrayElemAt: ["$players", 0] },
    
                }
            },
            {
                $project: {
                    _id: 1,
                    contest: 1,
                    wonContest: {
                        $filter: {
                            input: "$payout",
                            as: "item",
                            cond: { $eq: ["$$item.v", 1] }
                        }
                    },
                    inPlayContest: {
                        $filter: {
                            input: "$contest",
                            as: "item",
                            cond: { $eq: ["$$item.status", "notstarted"] }
                        }
                    },
                    amount: 1,
                    selectedTeam: 1,
                    winner: 1,
                    players: 1,
                    lostContest: {
                        $filter: {
                            input: "$payout",
                            as: "item",
                            cond: { $eq: ["$$item.v", 0] }
                        }
                    },
                }
            },
            {
                $addFields: { status: matchDetail.status }
            }
        ]).exec()
            .then(response => response)
         
    res.status(200).json({underOver:con1,underOver2: con5,comboMatch:con2,fantasy:con3,custom:con4})
    
}

module.exports = getUserId