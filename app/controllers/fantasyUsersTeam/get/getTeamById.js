const mongoose = require('mongoose');
const fantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const Matches = mongoose.model('Matches');
const _ = require('lodash');
const moment = require('moment')

//,starting_at:{$gt: new Date().toISOString()}
const get = (req, res) => {
    fantasyUsersTeam.findById(req.params.teamId).populate('matchDetail').lean().then(response => {
        
        if(req.user.id !== response.userId.toString() && moment(response.matchDetail[0].starting_at).unix() > moment().unix()){
            return res.status(202).json({message:"Teams can viewed after match has started"});
        }
 
        let match = response.matchDetail[0]
  

         fantasyUsersTeam.aggregate([
            {$match: {_id: new mongoose.mongo.ObjectId(req.params.teamId)}},
            {
                $project: {
                    players: {$objectToArray: "$players"},
                    serialNumber:1,
                    teamName:1,
                    totalPoints: 1,
                    rank:1
                }
            },
            {$unwind: "$players"},
            {$group: {
                _id:"$players.v.position.name",
                players: {
                        $push: "$players"
                    },
                localTeam: {
                            $sum: {
                                $cond: {
                                    if: {$eq:["$players.v.teamId",match.localteam.id]},then: 1,else:0
                                }
                            }
                        },
                visitorTeam: {
                            $sum: {
                                $cond: {
                                    if: {$eq:["$players.v.teamId",match.visitorteam.id]},then: 1,else:0
                                }
                            }
                        },
                        serialNumber: {
                            $addToSet: "$serialNumber"
                        },
                        teamName: {
                            $addToSet: "$teamName"
                        }, 
                        totalPoints: {
                            $addToSet: "$totalPoints"
                        },
                        rank:{
                            $addToSet: "$rank"
                        },      
                    },

            },
            {$project: {
                players: {$arrayToObject:"$players"},
                localTeam:1,
                visitorTeam:1,
                serialNumber:1,
                teamName:1,
                totalPoints: 1,
                    rank:1
                }
            }
            ]).exec().then(response => {
 
              let FantasyPlayers = response.length !== 0 ?  {...response[0].players, ...response[1].players,...response[2].players,...response[3].players} : []

                FantasyPlayers =  _.orderBy(FantasyPlayers,['points'],['desc']);
                res.status(200).json({FantasyPlayers,
                    teamName:response[0].teamName[0],
                    serialNumber:response[0].serialNumber[0],
                    totalPoints: response[0].totalPoints[0],
                    rank:response[0].rank[0]})
            });
    })

}   


module.exports = get