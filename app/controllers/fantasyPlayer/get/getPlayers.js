const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const _ = require('lodash');

const get = (req, res) => {
    
    
    FantasyPlayer.findOne({matchId:parseInt(req.query.matchId)}).populate('matchDetail').lean().sort({_id:-1}).then(response => { 
        let obj = {
            matchId:response.matchId,
            matchDetail:response.matchDetail[0],
            localTeam:response.localTeam,
            visitorTeam:response.visitorTeam,
            totalTeams:response.totalTeams,
            players:{
                ...response.players[response.localTeam],
                ...response.players[response.visitorTeam],
            },
            // Allrounder:{...response.players[response.localTeam].Allrounder,...response.players[response.visitorTeam].Allrounder},
            // Batsman:{...response.players[response.localTeam].Batsman,...response.players[response.visitorTeam].Batsman},
            // Wicketkeeper:{...response.players[response.localTeam].Wicketkeeper,...response.players[response.visitorTeam].Wicketkeeper},
            // Bowler:{...response.players[response.localTeam].Bowler,...response.players[response.visitorTeam].Bowler},
        }
        // _.groupBy(obj.players,[''])
        console.log('pla: ');
        let pla = _.orderBy(obj.players,['credit'],["desc"])
        pla = _.groupBy(obj.players,'position.id')
 
         obj.Allrounder = _.orderBy(pla['4'],['credit'],["desc"])
         
         obj.Batsman = _.orderBy(pla['1'],['credit'],["desc"])
         obj.Wicketkeeper = _.orderBy(pla['3'],['credit'],["desc"])
          obj.Bowler = _.orderBy(pla['2'],['credit'],["desc"])

        res.status(200).json(obj);
    })
}   


module.exports = get