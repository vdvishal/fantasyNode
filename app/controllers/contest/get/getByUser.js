const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
 
/**
 * 
 * @param {*} req
 *               playerId:req.params.playerId,matchId:req.params.matchId             
 *  
 * @param {*} res 
 */


const getUserId = (req, res) => {
    Contest.aggregate([
        {
            $match:{
                matchId:"dev_season_2014_q7",
                $or:[
                    {redTeam:{
                        $elemMatch: {userId:new mongoose.mongo.ObjectID("5ec44c8ab5da0a3d84b8382a")}
                    }},{
                    blueTeam:{
                        $elemMatch: {userId:new mongoose.mongo.ObjectID("5ec44c8ab5da0a3d84b8382a")}
                    }}
                ]
            }
        },
        {
            $project:{
                finalTotal:0,
                profit:0
            }
        },
        {
            $group:{
                _id :'$type',
                contest: { $push: "$$ROOT" }
            }
        },
    ]).exec().then(response => res.status(200).json({data:response}))
}

module.exports = getUserId