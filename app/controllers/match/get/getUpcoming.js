const mongoose = require('mongoose');
const match = mongoose.model('Matches');
const Contest = mongoose.model('Contest');

const moment = require('moment')
 

const get = (req, res) => {

    if(req.query.matchId !== 'undefined' && req.query.matchId != 1){
        console.log(req.query.matchId);

        match.findOne({id:parseInt(req.query.matchId)}).exec().then(result => 
            res.status(200).json({match:result}))
        .catch(err => res.status(500).json(err))
    }else{
        console.log("req.query.matchId");

        match.find({}).sort({starting_at:1}).exec().then(result => 
            res.status(200).json({match:result}))
        .catch(err => res.status(500).json(err))
    }
}


module.exports = get