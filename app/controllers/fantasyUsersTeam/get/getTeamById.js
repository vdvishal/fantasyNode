const mongoose = require('mongoose');
const fantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const Matches = mongoose.model('Matches');

const get = (req, res) => {
    Matches.findOne({id:parseInt(req.params.matchId)}).lean().exec().then(match => {
        console.log(match);
        
        fantasyUsersTeam.aggregate([
            {$match: {_id: new mongoose.mongo.ObjectId(req.params.teamId)}},
            {
                $project: {
                    players: {$objectToArray: "$players"},
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
                        }        
                    },
            },
            {$project: {
                players: {$arrayToObject:"$players"},
                localTeam:1,
                visitorTeam:1
                }
            }
            ]).exec().then(response => {                       
            res.status(200).json(response);
        })
    })

}   


module.exports = get