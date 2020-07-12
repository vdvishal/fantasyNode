const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const moment = require('moment')
const patch = (req, res) => {
    console.log(req.body);

    var obj = {
        players: req.body.players
    };
    FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId(req.params.teamId)}, 
        {$set:obj}
    ).then(response => {
        res.status(200).json(response);
    })
}


module.exports = patch