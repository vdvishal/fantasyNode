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
                    {teamOne:{$elemMatch:{'userId':req.user.id}}},
                    {teamTwo:{$elemMatch:{'userId':req.user.id}}},
                    {teamThree:{$elemMatch:{'userId':req.user.id}}},
                    {teamFour:{$elemMatch:{'userId':req.user.id}}},
                    {teamFive:{$elemMatch:{'userId':req.user.id}}},
                    {teamSix:{$elemMatch:{'userId':req.user.id}}},
                    {teamSeven:{$elemMatch:{'userId':req.user.id}}},
                    {teamEight:{$elemMatch:{'userId':req.user.id}}},
                    {teamEight:{$elemMatch:{'userId':req.user.id}}},
                    {purpleTeam:{$elemMatch:{'userId':req.user.id}}}
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