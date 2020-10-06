const mongoose = require('mongoose');
const match = mongoose.model('Matches');
// const redis = require('../../../library/redis/redis');
const moment = require('moment')
const post = (req, res) => {
    console.log(req.body);

    match.updateOne({id:req.body.id},{...req.body,isLive:false},{upsert:true}).then(response => {

        // redis.HMSET('cricket_'+req.body.id)
        // redis.EXPIREAT('cricket_'+req.body.id,moment.unix(req.body.starting_at));
        
        res.status(200).json(response);
    })
}   


module.exports = post