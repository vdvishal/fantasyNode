const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const _ = require('lodash');

const get = (req, res) => {
    const agg = [
        {
          '$match': {
            'matchId': parseInt(req.params.matchId)
          }
        }, {
          '$project': {
            'players': {
              '$objectToArray': '$players'
            }
          }
        }, {
          '$project': {
            'players': {
              'v': 1
            }
          }
        }, {
          '$unwind': {
            'path': '$players'
          }
        }, {
          '$project': {
            'players': '$players.v'
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
          '$group': {
            '_id': null, 
            'players': {
              '$mergeObjects': '$players'
            }
          }
        }, {
          '$project': {
            'player': `$players.${req.params.playerId}`
          }
        }
      ];    
    FantasyPlayer.aggregate(agg).then(response => { 
        res.send(response)
    })
}   


module.exports = get


