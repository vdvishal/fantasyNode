const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');
const _ = require('lodash');
const chalk = require('chalk');

const redis = require('../../../libraries/redis/redis')

/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100              
 *  
 * @param {*} res 
 */


const get = async (req, res) => {
    let errRedis = false;
    // await Contest.find({matchId:parseInt(req.params.matchId),contestType:1})
    //     .sort({"playerInfo.fullname":1})
    //     .lean()
    //     .then(arr2 =>res.status(200).json({data:[{_id:1,contest:arr2}]}))
    //     .catch(err => err)

    // await Contest.find({matchId:parseInt(req.params.matchId),contestType:2})
    //     .sort({"playerInfo.fullname":1})
    //     .lean()
    //     .then(arr2 =>res.status(200).json({data:[{_id:1,contest:arr2}]}))
    //     .catch(err => err)
    try {
        redis.on('error',message => {
            console.log('message: ', message);
            errRedis = true
        })
    if(errRedis){
        console.log('errRedis: ', chalk.redBright(errRedis));

        Contest.aggregate([
            {
                $match:{
                    $or:[
                        {matchId:parseInt(req.params.matchId),contestType:1},
                        {matchId:parseInt(req.params.matchId),contestType:2}
                    ]
                }
            },
            {$sort:  {'playerInfo.fullname': 1}}, 
            {
                $group:{
                    _id:"$contestType",
                    contest:{
                        $push:"$$ROOT"
                    }
                }
            },
        ]).then(response => {
            res.status(200).json({data:response})
        })
    }else{
        console.log('errRedis: ', chalk.redBright(errRedis));

        redis.HMGET('match',`underOver-${req.params.matchId}`,(err,response) => {
            console.log('req.params.matchId: ', req.params.matchId);
            if(response && response[0] !== null ){
                res.status(200).json({data:JSON.parse(response)})
            }else{
                Contest.aggregate([
                    {
                        $match:{
                            $or:[
                                {matchId:parseInt(req.params.matchId),contestType:1},
                                {matchId:parseInt(req.params.matchId),contestType:2}
                            ]
                        }
                    },
                    {$sort:  {'playerInfo.fullname': 1}}, 
                    {
                        $group:{
                            _id:"$contestType",
                            contest:{
                                $push:"$$ROOT"
                            }
                        }
                    },
                ]).then(response => {
                    redis.HMSET('match',`underOver-${req.params.matchId}`,JSON.stringify(response),
                    (err,response) => {
                        console.log('err: redis.HMSET: underOver', err);
    
                    })
                    res.status(200).json({data:response})
                })
            }
        })
    }


} catch (error) {
    console.log('error: ', error);
        
}
}

module.exports = get