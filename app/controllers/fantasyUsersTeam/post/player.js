const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const moment = require('moment')
const post = (req, res) => {
    console.log(req.body);

    var obj = new FantasyUsersTeam({
        userId: "req.user.id",
        teamName:  Math.random()*100 + "req.user.userName",
        matchId: parseInt(req.body.matchId),
        players: req.body.players
    });
    obj.save().then(response => {
        res.status(200).json(response);
    })
}


module.exports = post