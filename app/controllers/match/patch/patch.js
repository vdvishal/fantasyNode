const mongoose = require('mongoose');
const match = mongoose.model('Matches');
// const redis = require('../../../libraries/redis/redis')

module.exports = (req,res) => {
    // redis.flushall();
    
    match.update({
        id:parseInt(req.body.matchId)
    },{
        $set:{
            isOnsite:true
        }
    }).then(response => res.send({message:"match live"}))
} 