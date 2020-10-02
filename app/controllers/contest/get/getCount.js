const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const UnderOverContest = mongoose.model('UnderOverContest');
const MatchUpContest = mongoose.model('MatchUpContest');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
const Matches = mongoose.model('Matches');
const Orders = mongoose.model('Orders');


module.exports = async (req, res) => {
     
    let type = await Orders.aggregate([
        [
            {
              '$match': {
                'matchId': parseInt(req.params.matchId)
              }
            }, {
              '$group': {
                '_id': '$contestType', 
                'amountCollected': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$status', 'contest_debit'
                        ]
                      }, 
                      'then': {$divide: [ "$amount", 100 ]}, 
                      'else': 0
                    }
                  }
                }, 
                'amountPaid': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$status', 'contest_credit'
                        ]
                      }, 
                      'then': {$divide: [ "$amount", 100 ]}, 
                      'else': 0
                    }
                  }
                }
              }
            }, {
              '$project': {
                '_id': 1, 
                'amountCollected': 1, 
                'amountPaid': 1, 
                'profit': {
                  '$subtract': [
                    '$amountCollected', '$amountPaid'
                  ]
                }
              }
            }
          ]
    ])

    let type2 = await Orders.aggregate([
        [
            {
              '$match': {
                'matchId': parseInt(req.params.matchId)
              }
            }, {
              '$group': {
                '_id': null, 
                'amountCollected': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$status', 'contest_debit'
                        ]
                      }, 
                      'then': {$divide: [ "$amount", 100 ]}, 
                      'else': 0
                    }
                  }
                }, 
                'amountPaid': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$status', 'contest_credit'
                        ]
                      }, 
                      'then': {$divide: [ "$amount", 100 ]}, 
                      'else': 0
                    }
                  }
                }
              }
            }, {
              '$project': {
                '_id': 1, 
                'amountCollected': 1, 
                'amountPaid': 1, 
                'profit': {
                  '$subtract': [
                    '$amountCollected', '$amountPaid'
                  ]
                }
              }
            }
          ]
    ])
    type2 = type2.length > 0 ?  type2[0] : {}
    res.status(200).json([...type,type2])
}

