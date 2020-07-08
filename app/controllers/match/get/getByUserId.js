const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
/**
 * 
 * @param {*} req
 *               status: past, upcoming, live            
 *          
 * @param {*} res 
 */


const getUserId = (req, res) => {
    Contest.aggregate([
        {
            $match:{
                status:req.params.status,
                $or:[
                    {teamOne:{$elemMatch:{'userId':'userId'}}},
                    {teamTwo:{$elemMatch:{'userId':'userId'}}},
                    {teamThree:{$elemMatch:{'userId':'userId'}}},
                    {teamFour:{$elemMatch:{'userId':'userId'}}},
                    {teamFive:{$elemMatch:{'userId':'userId'}}},
                    {teamSix:{$elemMatch:{'userId':'userId'}}},
                    {teamSeven:{$elemMatch:{'userId':'userId'}}},
                    {teamEight:{$elemMatch:{'userId':'userId'}}},
                    {teamEight:{$elemMatch:{'userId':'userId'}}},
                    {purpleTeam:{$elemMatch:{'userId':'userId'}}}
                ]
            }
        },
        {
            $project:{
                matchId:1
            }
        },  
        {
            $group:{
                _id :'$matchId',
                matchId: { $push: "$matchId" }
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'matchId',
                foreignField: 'key',
                as: 'matchList'
                }
        }

]).exec().then(response => res.status(200).json({data:response}))
}

module.exports = getUserId