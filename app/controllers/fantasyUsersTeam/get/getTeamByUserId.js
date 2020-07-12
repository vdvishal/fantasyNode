const mongoose = require('mongoose');
const fantasyUsersTeam = mongoose.model('FantasyUsersTeam');

const get = (req, res) => {
    fantasyUsersTeam.aggregate([
        {
            $match: {
                matchId: parseInt(req.params.matchId),
                userId: "req.user.id"
            }
        },
        {
            $project: {
                players: { $objectToArray: "$players" },
                teamName: 1
            }
        },
        {
            $project: {
                players: 1,
                teamName: 1,
                captain: {
                    $filter: {
                        input: "$players",
                        as: "player",
                        cond: { $eq: [ "$$player.v.captain", true ] }
                     }
                },
                viceCaptain: {
                    $filter: {
                        input: "$players",
                        as: "player",
                        cond: { $eq: [ "$$player.v.viceCaptain", true ] }
                     }
                },
                Allrounder: {
                    $filter: {
                        input: "$players",
                        as: "player",
                        cond: { $eq: [ "$$player.v.position.name", "Allrounder" ] }
                     }
                },
                Batsman: {
                    $filter: {
                        input: "$players",
                        as: "player",
                        cond: { $eq: [ "$$player.v.position.name", "Batsman"] }
                     }
                },
                Wicketkeeper: {
                    $filter: {
                        input: "$players",
                        as: "player",
                        cond: { $eq: [ "$$player.v.position.name", "Wicketkeeper" ] }
                     }
                },
                Bowler: {
                    $filter: {
                        input: "$players",
                        as: "player",
                        cond: { $eq: [ "$$player.v.position.name", "Bowler"] }
                     }
                },
            }
        },
       
        {$project: {
            teamName:1,
            captain: {$arrayElemAt:[ "$captain", 0 ]},
            viceCaptain: {$arrayElemAt:[ "$viceCaptain", 0 ]},
            Allrounder: {$size:"$Allrounder"},
            Batsman: {$size:"$Batsman"},
            Wicketkeeper: {$size:"$Wicketkeeper"},
            Bowler:{$size:"$Bowler"},
            }
        },
        {$project: {
            teamName:1,
            captain: "$captain.v",
            viceCaptain:  "$viceCaptain.v",
            Allrounder: 1,
            Batsman: 1,
            Wicketkeeper: 1,
            Bowler: 1
            }
        }
    ]).then(response => {
            console.log(response);
            
            res.status(200).json(response);
        })
}


module.exports = get