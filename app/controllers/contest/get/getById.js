const mongoose = require('mongoose');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
const Matches = mongoose.model('Matches');

const AppStats = mongoose.model('AppStats');
const _ = require('lodash');
const moment = require('moment')

/**
 * 
 * @param {*} req
 *               playerId:req.params.playerId,matchId:req.params.matchId             
 *  
 * @param {*} res 
 */


const getById = async (req, res) => {
  
    let myTeam = await FantasyJoinedUsers.aggregate([
        {
            $match:{
                userId: mongoose.mongo.ObjectID(req.user.id),
                contestId: mongoose.mongo.ObjectID(req.params.contestId),
            }
        },
        {
            $lookup:{
                from:"fantasyusersteams",
                localField: 'teamId',
                foreignField: '_id',
                as: 'teamDetails'
            }
        },
        {
            $lookup:{
                from:"fantasycontests",
                localField: 'contestId',
                foreignField: '_id',
                as: 'contestDetails'
            }
        },
        {
            $lookup:{
                from:"users",
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $project:{
                contestDetails:{$arrayElemAt: [ "$contestDetails", 0 ]},
                teamDetails:{$arrayElemAt: [ "$teamDetails", 0 ]},
                userDetails:{$arrayElemAt : ["$userDetails",0]},
            }
        },
        {
            $project:{
                contestDetails:1,
                teamDetails:1,
                userDetails: {
                    userName:1,
                    profilePic:1
                },
                playerDetails:{$objectToArray : "$teamDetails.players"},
            }
        },
        {
            $project:{
                contestDetails:1,
                teamDetails:1,
                userDetails:1,
                points: { $sum: "$playerDetails.v.points" },
            }
        },
        {
            $sort:{
                "points" : -1
            }
        },
    ])
    .then(response => response)
    .catch(err => err)

    let Match = await Matches.findOne({
        id: parseInt(req.params.matchId)
    }).then(response => response);

    let FantasyPlayers = await FantasyPlayer.findOne({
        matchId: parseInt(req.params.matchId)
    }).lean().then(response => ({
        ...response[response.localTeam].Allrounder, ...response[response.visitorTeam].Allrounder,
        ...response[response.localTeam].Batsman, ...response[response.visitorTeam].Batsman,
        ...response[response.localTeam].Wicketkeeper, ...response[response.visitorTeam].Wicketkeeper,
        ...response[response.localTeam].Bowler, ...response[response.visitorTeam].Bowler,
    }));

     let obj = {}
     Object.entries(FantasyPlayers).forEach(([key,value]) => {
         if(typeof value.points === 'number'){
        obj = {...obj,[key]:value}  
        console.log(obj);

    }})

    console.log(obj);
    

    FantasyPlayers = _.orderBy(obj,['points'],['desc'])

     
    res.status(200).json({myTeam,FantasyPlayers,Match})

}

module.exports = getById