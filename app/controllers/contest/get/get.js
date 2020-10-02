const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');
const _ = require('lodash');

/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100              
 *  
 * @param {*} res 
 */


const get = async (req, res) => {
 
    await Contest.aggregate([
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
    ]).then(response => res.status(200).json({data:response}))
}

module.exports = get