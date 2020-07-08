const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
 
const moment = require('moment')
const post = (req, res) => {
    console.log(req.body);

    FantasyPlayer.updateOne({matchId:req.body.matchId},req.body,{upsert:true}).then(response => {

        // redis.HMSET('cricket_'+req.body.id)
        // redis.EXPIREAT('cricket_'+req.body.key,moment.unix(req.body.starting_at));
        
        res.status(200).json(response);
    })
}   


module.exports = post