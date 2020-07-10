const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');

const get = (req, res) => {
    console.log(req.query);
    
    FantasyPlayer.findOne({matchId:parseInt(req.query.matchId)}).lean().sort({_id:-1}).then(response => {      
        res.status(200).json({
            Allrounder:{...response[response.localTeam].Allrounder,...response[response.visitorTeam].Allrounder},
            Batsman:{...response[response.localTeam].Batsman,...response[response.visitorTeam].Batsman},
            Wicketkeeper:{...response[response.localTeam].Wicketkeeper,...response[response.visitorTeam].Wicketkeeper},
            Bowler:{...response[response.localTeam].Bowler,...response[response.visitorTeam].Bowler},
        });
    })
}   


module.exports = get