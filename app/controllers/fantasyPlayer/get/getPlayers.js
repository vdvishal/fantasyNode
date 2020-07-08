const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');

const get = (req, res) => {
    FantasyPlayer.find({matchId:req.query.matchId}).sort({_id:-1}).then(response => {       
        res.status(200).json(response);
    })
}   


module.exports = get