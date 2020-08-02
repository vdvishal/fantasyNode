const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const _ = require('lodash');

const get = (req, res) => {
    console.log("-------------");
    
    FantasyPlayer.findOne({matchId:parseInt(req.query.matchId)}).populate('matchDetail').lean().sort({_id:-1}).then(response => { 
        let obj = {
            matchId:response.matchId,
            matchDetail:response.matchDetail[0],
            localTeam:response.localTeam,
            visitorTeam:response.visitorTeam,
            totalTeams:response.totalTeams,
            Allrounder:{...response[response.localTeam].Allrounder,...response[response.visitorTeam].Allrounder},
            Batsman:{...response[response.localTeam].Batsman,...response[response.visitorTeam].Batsman},
            Wicketkeeper:{...response[response.localTeam].Wicketkeeper,...response[response.visitorTeam].Wicketkeeper},
            Bowler:{...response[response.localTeam].Bowler,...response[response.visitorTeam].Bowler},
        }
        
        obj.Allrounder = _.orderBy(obj.Allrounder,['credit'],["desc"])
        
        obj.Batsman = _.orderBy(obj.Batsman,['credit'],["desc"])
        obj.Wicketkeeper = _.orderBy(obj.Wicketkeeper,['credit'],["desc"])
        obj.Bowler = _.orderBy(obj.Bowler,['credit'],["desc"])

        res.status(200).json(obj);
    })
}   


module.exports = get