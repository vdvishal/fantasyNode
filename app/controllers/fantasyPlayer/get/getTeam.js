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
                [response.localTeam]:{...response.players[response.localTeam].Allrounder,
                    ...response.players[response.localTeam].Batsman,
                    ...response.players[response.localTeam].Wicketkeeper,
                    ...response.players[response.localTeam].Bowler},
                [response.visitorTeam]:{...response.players[response.visitorTeam].Allrounder,
                    ...response.players[response.visitorTeam].Batsman,
                    ...response.players[response.visitorTeam].Wicketkeeper,
                    ...response.players[response.visitorTeam].Bowler},
            }

        }
        
        obj.players[response.localTeam] = _.orderBy(obj.players[response.localTeam],['points'],["desc"])
        
        obj.players[response.visitorTeam] = _.orderBy(obj.players[response.visitorTeam],['points'],["desc"])
 

        res.status(200).json(obj);
    })
}   


module.exports = get