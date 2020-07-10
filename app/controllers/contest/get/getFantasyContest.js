const mongoose = require('mongoose');
const Contest = mongoose.model('FantasyContest');
const AppStats = mongoose.model('AppStats');
const _ = require('lodash');

const get = (req, res) => {
    Contest.find({matchId:parseInt(req.params.matchId)})
        .exec()
        .then(response => {
            console.log(response);
            
            res.status(200).json({
                data:response
            })
        }).catch(err => {
            res.status(500).json({
                message:"Server error"
            })
        })
}


module.exports = get