const mongoose = require('mongoose');
const FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
const updateWorker = require('../../../workfarm/index');

const patch = async (req, res) => {
 
    var obj = {
        players: req.body.players
    };

    let prevTeam = await FantasyUsersTeam.findOne({_id: new mongoose.mongo.ObjectId(req.params.teamId)})
    .then(resp => resp)

    updateWorker.teamUpdate(req.body,prevTeam,2);

    await FantasyUsersTeam.updateOne(
        { _id: new mongoose.mongo.ObjectId(req.params.teamId)}, 
        {$set:obj}
    ).then(response => {
        res.status(200).json(response);
    })
}


module.exports = patch