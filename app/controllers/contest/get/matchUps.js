const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');
const _ = require('lodash');
// const redis = require('../../../libraries/redis/redis')

const get = (req, res) => {
    let errRedis = true;

    // redis.on('error',message => {
    //     console.log('message: ', message);
    //     errRedis = true
    // })
    if(errRedis){
        console.log('errRedis: ', errRedis);

        Contest.find({matchId:parseInt(req.params.matchId),contestType:3})
        .exec()
        .then(response => {   
    
            res.status(200).json({
                data:response
            })
        }).catch(err => {
            res.status(502).json({
                message:"Server error"
            })
        })
    }else{
        redis.HMGET('match',`matchUp-${req.params.matchId}`,(err,response) => {
            if(response && response[0] !== null ){
                res.status(200).json({data:JSON.parse(response)})
            }else{
                Contest.find({matchId:parseInt(req.params.matchId),contestType:3})
                .exec()
                .then(response => {   
                    redis.HMSET('match',`matchUp-${req.params.matchId}`,JSON.stringify(response),
                    (err,response) => {
                        console.log('err: redis.HMSET: matchUp', err);
                    })
                    res.status(200).json({
                        data:response
                    })
                }).catch(err => {
                    res.status(502).json({
                        message:"Server error"
                    })
                })
            }
        })
    }
}


module.exports = get