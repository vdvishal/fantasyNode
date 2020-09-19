const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const _ = require('lodash');
const redis = require('../../../libraries/redis/redis');

const get = (req, res) => {
 
    redis.HMGET("players",`${req.params.playerId}`,async (err,response) => {
        if(response !== null && response !== undefined && response[0] !== null){
            return res.send(JSON.parse(response))
        }else{
                  
            const aggT20 = [
                {
                '$lookup': {
                    'from': 'matches', 
                    'localField': 'matchId', 
                    'foreignField': 'id', 
                    'as': 'matchDetails'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }, 
                    'matchDetails': {
                    '$arrayElemAt': [
                        '$matchDetails', 0
                    ]
                    }
                }
                }, 
                {
                '$match': {
                    '$or': [
                    {
                        'matchDetails.type': 'T20'
                    }, {
                        'matchDetails.type': 'T20I'
                    }
                    ]
                }
                },
                {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                },
                {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, 
                {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                },
                {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, 
                {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, 
                {
                '$match': {
                    'players.id': parseInt(req.params.playerId)
                }
                }, 
                {
                '$group': {
                    '_id': '$players.id', 
                    detail:{$push:"$players"},
                    'avgPoints': {
                    '$avg': '$players.points'
                    }, 
                    'runs': {
                    '$sum': '$players.battingScoreCard.score'
                    }, 
                    'wickets': {
                    '$sum': '$players.bowlingScoreCard.wickets'
                    }, 
                    'avgRate': {
                    '$avg': '$players.battingScoreCard.score'
                    }, 
                    'avgWickets': {
                    '$avg': '$players.bowlingScoreCard.wickets'
                    }, 
                    'match': {
                    '$sum': 1
                    }
                }
                },{
                '$project': {
                    _id: 1,
                    detail:{$arrayElemAt:["$detail",0]},
                    avgPoints: 1,
                    runs: 1,
                      wickets: 1,
                    avgRate: 1,
                      avgWickets:1,
                    match:1
                  }}
            ]

            const aggODI = [
                {
                '$lookup': {
                    'from': 'matches', 
                    'localField': 'matchId', 
                    'foreignField': 'id', 
                    'as': 'matchDetails'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }, 
                    'matchDetails': {
                    '$arrayElemAt': [
                        '$matchDetails', 0
                    ]
                    }
                }
                }, {
                '$match': {
                    '$or': [
                    {
                        'matchDetails.type': 'ODI'
                    }, {
                        'matchDetails.type': 'ODI'
                    }
                    ]
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$match': {
                    'players.id': `${parseInt(req.params.playerId)}`
                }
                },                {
                    '$group': {
                        '_id': '$players.id', 
                        detail:{$push:"$players"},
                        'avgPoints': {
                        '$avg': '$players.points'
                        }, 
                        'runs': {
                        '$sum': '$players.battingScoreCard.score'
                        }, 
                        'wickets': {
                        '$sum': '$players.bowlingScoreCard.wickets'
                        }, 
                        'avgRate': {
                        '$avg': '$players.battingScoreCard.score'
                        }, 
                        'avgWickets': {
                        '$avg': '$players.bowlingScoreCard.wickets'
                        }, 
                        'match': {
                        '$sum': 1
                        }
                    }
                    },
                    {
                        '$project': {
                            _id: 1,
                            detail:{$arrayElemAt:["$detail",0]},
                            avgPoints: 1,
                            runs: 1,
                              wickets: 1,
                            avgRate: 1,
                              avgWickets:1,
                            match:1
                          }}
            ]

            const aggTest = [
                {
                '$lookup': {
                    'from': 'matches', 
                    'localField': 'matchId', 
                    'foreignField': 'id', 
                    'as': 'matchDetails'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }, 
                    'matchDetails': {
                    '$arrayElemAt': [
                        '$matchDetails', 0
                    ]
                    }
                }
                }, {
                '$match': {
                    '$or': [
                    {
                        'matchDetails.type': 'Test/5day'
                    }, {
                        'matchDetails.type': 'Test'
                    }, {
                        'matchDetails.type': '4day'
                    }
                    ]
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$match': {
                    'players.id': `${parseInt(req.params.playerId)}`
                }
                },                 {
                    '$group': {
                        '_id': '$players.id', 
                        detail:{$push:"$players"},
                        'avgPoints': {
                        '$avg': '$players.points'
                        }, 
                        'runs': {
                        '$sum': '$players.battingScoreCard.score'
                        }, 
                        'wickets': {
                        '$sum': '$players.bowlingScoreCard.wickets'
                        }, 
                        'avgRate': {
                        '$avg': '$players.battingScoreCard.score'
                        }, 
                        'avgWickets': {
                        '$avg': '$players.bowlingScoreCard.wickets'
                        }, 
                        'match': {
                        '$sum': 1
                        }
                    }
                    },
                    {
                        '$project': {
                            _id: 1,
                            detail:{$arrayElemAt:["$detail",0]},
                            avgPoints: 1,
                            runs: 1,
                              wickets: 1,
                            avgRate: 1,
                              avgWickets:1,
                            match:1
                          }}
            ]

            
            const aggT10 = [
                {
                '$lookup': {
                    'from': 'matches', 
                    'localField': 'matchId', 
                    'foreignField': 'id', 
                    'as': 'matchDetails'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }, 
                    'matchDetails': {
                    '$arrayElemAt': [
                        '$matchDetails', 0
                    ]
                    }
                }
                }, {
                '$match': {
                    '$or': [
                    {
                        'matchDetails.type': 'T10'
                    }
                    ]
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$project': {
                    'players': {
                    '$objectToArray': '$players'
                    }
                }
                }, {
                '$project': {
                    'players': '$players.v'
                }
                }, {
                '$unwind': {
                    'path': '$players'
                }
                }, {
                '$match': {
                    'players.id': `${parseInt(req.params.playerId)}`
                }
                },                 {
                    '$group': {
                        '_id': '$players.id', 
                        detail:{$push:"$players"},
                        'avgPoints': {
                        '$avg': '$players.points'
                        }, 
                        'runs': {
                        '$sum': '$players.battingScoreCard.score'
                        }, 
                        'wickets': {
                        '$sum': '$players.bowlingScoreCard.wickets'
                        }, 
                        'avgRate': {
                        '$avg': '$players.battingScoreCard.score'
                        }, 
                        'avgWickets': {
                        '$avg': '$players.bowlingScoreCard.wickets'
                        }, 
                        'match': {
                        '$sum': 1
                        }
                    }
                    },
                    {
                        '$project': {
                            _id: 1,
                            detail:{$arrayElemAt:["$detail",0]},
                            avgPoints: 1,
                            runs: 1,
                              wickets: 1,
                            avgRate: 1,
                              avgWickets:1,
                            match:1
                          }}
            ]

            let t20 = await FantasyPlayer.aggregate(aggT20).then(response => response)
            let ODI = await FantasyPlayer.aggregate(aggODI).then(response => response)
            let Test = await FantasyPlayer.aggregate(aggTest).then(response => response)
            let T10 = await FantasyPlayer.aggregate(aggT10).then(response => response)

            redis.HMSET("players",req.params.playerId,JSON.stringify({
                T20:t20[0],ODI:ODI[0],Test:Test[0],T10:T10[0],
            }),(err,res) => {
                
            })

            res.send({
                T20:t20[0],ODI:ODI[0],Test:Test[0],T10:T10[0],
            })
        }
    })
}   


module.exports = get




