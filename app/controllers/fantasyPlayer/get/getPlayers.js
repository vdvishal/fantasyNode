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
            Allrounder:{...response.players[response.localTeam].Allrounder,...response.players[response.visitorTeam].Allrounder},
            Batsman:{...response.players[response.localTeam].Batsman,...response.players[response.visitorTeam].Batsman},
            Wicketkeeper:{...response.players[response.localTeam].Wicketkeeper,...response.players[response.visitorTeam].Wicketkeeper},
            Bowler:{...response.players[response.localTeam].Bowler,...response.players[response.visitorTeam].Bowler},
        }
        
        obj.Allrounder = _.orderBy(obj.Allrounder,['credit'],["desc"])
        
        obj.Batsman = _.orderBy(obj.Batsman,['credit'],["desc"])
        obj.Wicketkeeper = _.orderBy(obj.Wicketkeeper,['credit'],["desc"])
        obj.Bowler = _.orderBy(obj.Bowler,['credit'],["desc"])

        res.status(200).json(obj);
    })
}   


module.exports = get