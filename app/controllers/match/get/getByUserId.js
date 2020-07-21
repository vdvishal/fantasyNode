const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const UnderOverContest = mongoose.model('UnderOverContest');
const MatchUpContest = mongoose.model('MatchUpContest');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');

const _ = require('lodash')
/**
 * 
 * @param {*} req
 *               status: past, upcoming, live            
 *          
 * @param {*} res 
 */


const getUserId = async (req, res) => {
    console.log(req.user.id);
    
    let response1 = await Contest.aggregate([
        {
            $match:{
                $or:[
                    {teamOne:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamTwo:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamThree:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamFour:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamFive:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamSix:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamSeven:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                    {teamEight:{$elemMatch:{'userId':new mongoose.mongo.ObjectID(req.user.id)}}},
                ]
            }
        },
        {
            $project:{
                matchId: 1
            }
        },  
        {
            $group:{
                _id :'null',
                matchId: { $addToSet: "$matchId" }
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'matchId',
                foreignField: 'id',
                as: 'matchList'
                }
        },
        {
            $sort: {
                "matchList.starting_at" : -1
            }
        },
        {
            $limit: 50
        }
    ]).exec().then(response => {

        return response
        // res.status(200).json({data:response})
    })

    let response2 = await UnderOverContest.aggregate([
        {
            $match:{'userId':new mongoose.mongo.ObjectID(req.user.id)}
        },
        {
            $project:{
                matchId:1
            }
        },
        {
            $group:{
                _id :'null',
                matchId: { $addToSet: "$matchId" }
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'matchId',
                foreignField: 'id',
                as: 'matchList'
                }
        },
        {
            $sort: {
                "matchList.starting_at" : -1
            }
        },
        {
            $limit: 50
        }
    ]).exec().then(response => {
        return response
    })

    let response3 = await MatchUpContest.aggregate([
        {
            $match:{'userId':new mongoose.mongo.ObjectID(req.user.id)}
        },
        {
            $project:{
                matchId:1
            }
        },
        {
            $group:{
                _id :'null',
                matchId: { $addToSet: "$matchId" }
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'matchId',
                foreignField: 'id',
                as: 'matchList'
                }
        },
        {
            $sort: {
                "matchList.starting_at" : -1
            }
        },
        {
            $limit: 50
        }
    ]).exec().then(response => {
        return response
    })

    let response4 = await FantasyJoinedUsers.aggregate([
        {
            $match:{'userId':new mongoose.mongo.ObjectID(req.user.id)}
        },
        {
            $project:{
                matchId:1
            }
        },
        {
            $group:{
                _id :'null',
                matchId: { $addToSet: "$matchId" }
            }
        },
        {
            $lookup: {
                from: 'matches',
                localField: 'matchId',
                foreignField: 'id',
                as: 'matchList'
                }
        },
        {
            $sort: {
                "matchList.starting_at" : -1
            }
        },
        {
            $limit: 50
        }
    ]).exec().then(response => {
        return response
    })

    response1 = response1[0] ? response1[0].matchList : []

    response2 = response2[0] ? response2[0].matchList : []

    response3 = response3[0] ? response3[0].matchList : []

    response4 = response4[0] ? response4[0].matchList : []

 
    let lll = _.uniqBy([...response1,
        ...response2,
        ...response3,
        ...response4],"id")

    lll = _.orderBy(lll,['starting_at'],['desc'])
    lll = _.groupBy(lll,"status")
    
    console.log(lll);
    
    res.status(200).json({data:lll})

}

module.exports = getUserId