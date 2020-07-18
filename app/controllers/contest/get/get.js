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


const get = (req, res) => {
    Contest.aggregate([
        {
            $match:{
                matchId:parseInt(req.params.matchId),
                
            }
        },
        {
            $project: {
                _id:1,
                contestName:1,
                contestType:1,
                type:1,
                typeName:1,
                value1:1,
                value2:1,
                matchId:1,
                playerId:1,
                playerIds:1,
                playerInfo:1,
                totalAmount:1,
                finalTotal:1,
                'teamOne':1,
                'teamOneAmount': {
                            $filter: {
                            input: '$teamOne',
                            as: 'teamOne',
                            cond: {$eq: ['$$teamOne.userId', "req.user.id"]}
                        }
                    },
               'teamTwo':1,
                'teamTwoAmount': {$filter: {
                    input: '$teamTwo',
                    as: 'teamTwo',
                    cond: {$eq: ['$$teamTwo.userId', "req.user.id"]}
                },
                },
               'teamThree':1,
                'teamThreeAmount': {$filter: {
                    input: '$teamThree',
                    as: 'teamThree',
                    cond: {$eq: ['$$teamThree.userId', "req.user.id"]}
                },
                },
                'teamFour':1,
                'teamFourAmount': {$filter: {
                    input: '$teamFour',
                    as: 'teamFour',
                    cond: {$eq: ['$$teamFour.userId', "req.user.id"]}
                },
                },
               'teamFive':1,
                'teamFiveAmount': {$filter: {
                    input: '$teamFive',
                    as: 'teamFive',
                    cond: {$eq: ['$$teamFive.userId', "userId"]}
                },
                },
                'teamSix':1,
                'teamSixAmount': {$filter: {
                    input: '$teamSix',
                    as: 'teamSix',
                    cond: {$eq: ['$$teamSix.userId', "userId"]}
                },
                },
               'teamSeven':1,
                'teamSevenAmount': {$filter: {
                    input: '$teamSeven',
                    as: 'teamSeven',
                    cond: {$eq: ['$$teamSeven.userId', "userId"]}
                },
                },
               'teamEight':1,
                'teamEightAmount': {$filter: {
                    input: '$teamEight',
                    as: 'teamEight',
                    cond: {$eq: ['$$teamEight.userId', "userId"]}
                },
                },
                 
               
            },
        },
        {
            $project: {
                _id:1,
                 contestName:1,
                contestType:1,
                type:1,
                typeName:1,
                value1:1,
                value2:1,
                matchId:1,
                playerId:1,
                playerIds:1,
                playerInfo:1,
                totalAmount:1,
                finalTotal:1,
                "teamOne":1,
                "teamTwo":1,
                "teamThree":1,
                "teamFour":1,
                "teamFive":1,
                "teamSix":1,
                "teamSeven":1,
                "teamEight":1,
                'teamOneAmount': {$sum: "$teamOneAmount.amount"},
                'teamOnePayout':{ $cond: [ { $eq: [ "$totalAmount.teamOne", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamOne"]} ] },
                'teamTwoAmount': {$sum: "$teamTwoAmount.amount",
                },
               'teamTwoPayout': { $cond: [ { $eq: [ "$totalAmount.teamTwo", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamTwo"]} ] }, // { $divide:["$finalTotal", {$cond: { if:{ "$gt": ["$totalAmount.teamTwo",0], then: "$totalAmount.teamTwo", else: 1 }}}]},
                 'teamThreeAmount':{$sum: "$teamThreeAmount.amount",
                },
               'teamThreePayout':{ $cond: [ { $eq: [ "$totalAmount.teamThree", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamThree"]} ] },
                 'teamFourAmount': {$sum: "$teamFourAmount.amount",
                },
               'teamFourPayout':{ $cond: [ { $eq: [ "$totalAmount.teamFour", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamFour"]} ] },
                 'teamFiveAmount': {$sum: "$teamFiveAmount.amount",
                },
               'teamFivePayout':{ $cond: [ { $eq: [ "$totalAmount.teamFive", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamFive"]} ] },
                 'teamSixAmount': {$sum: "$teamSixAmount.amount",
                },
               'teamSixPayout':{ $cond: [ { $eq: [ "$totalAmount.teamSix", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamSix"]} ] },
                 'teamSevenAmount': {$sum: "$teamSevenAmount.amount",
                },
               'teamSevenPayout':{ $cond: [ { $eq: [ "$totalAmount.teamSeven", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamSeven"]} ] },
                 'teamEightAmount': {$sum: "$teamEightAmount.amount",
                },
               'teamEightPayout':{ $cond: [ { $eq: [ "$totalAmount.teamEight", 0 ] }, 0, {$divide:["$finalTotal","$totalAmount.teamEight"]} ] },
             },
        },
        {
            $group:{
                _id :'$contestType',
                contest: { $push: "$$ROOT" }
            }
        },
        {
            $sort:{
                _id:1
            }
        }
    ]).exec().then(response => {
         
        let arr = [];
        let arr2 = [];
        
        response.forEach(con => {
           con._id === 2 ?  arr = con.contest : [];
           con._id === 1 ?  arr2 = con.contest : [];

        })


        let sortedContest = []
        arr.forEach(contest => {
            let playerIds = [];
            contest.playerIds.forEach(player => {                
                if(player.contestTeam === 1){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamOneAmount,
                        totalAmount:contest.totalAmount.teamOne,
                        // totalPlayerCount:_.uniqBy(contest.teamOne,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamOne ? contest.finalTotal/contest.totalAmount.teamOne : 0.85*contest.finalTotal/contest.totalAmount.teamOne || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamOne  ? contest.finalTotal : contest.finalTotal*0.85 || 0 ,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamOne  ? contest.finalTotal*contest.teamOneAmount/contest.totalAmount.teamOne - (contest.finalTotal*contest.teamOneAmount/contest.totalAmount.teamOne-contest.teamOneAmount)*0.15 : 0.85*contest.finalTotal*contest.teamOneAmount/contest.totalAmount.teamOne || 0   
                    })
                }else if(player.contestTeam === 2){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamTwoAmount,
                        totalAmount:contest.totalAmount.teamTwo,
                        // totalPlayerCount:_.uniqBy(contest.teamTwo,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamTwo ? contest.finalTotal/contest.totalAmount.teamTwo : 0.85*contest.finalTotal/contest.totalAmount.teamTwo || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamTwo  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamTwo  ? contest.finalTotal*contest.teamTwoAmount/contest.totalAmount.teamTwo - (contest.finalTotal*contest.teamTwoAmount/contest.totalAmount.teamTwo-contest.teamTwoAmount)*0.15 : 0.85*contest.finalTotal*contest.teamTwoAmount/contest.totalAmount.teamTwo || 0,  
                    
                    })
                }else if(player.contestTeam === 3){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamThreeAmount,
                        totalAmount:contest.totalAmount.teamThree,
                        // totalPlayerCount:_.uniqBy(contest.teamThree,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamThree ? contest.finalTotal/contest.totalAmount.teamThree : 0.85*contest.finalTotal/contest.totalAmount.teamThree || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamThree  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamThree  ? contest.finalTotal*contest.teamThreeAmount/contest.totalAmount.teamThree - (contest.finalTotal*contest.teamThreeAmount/contest.totalAmount.teamThree-contest.teamThreeAmount)*0.15 : 0.85*contest.finalTotal*contest.teamThreeAmount/contest.totalAmount.teamThree || 0, 
                    
                    })
                }else if(player.contestTeam === 4){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamFourAmount,
                        totalAmount:contest.totalAmount.teamFour,
                        // totalPlayerCount:_.uniqBy(contest.teamFour,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamFour ? contest.finalTotal/contest.totalAmount.teamFour : 0.85*contest.finalTotal/contest.totalAmount.teamFour || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamFour  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamFour  ? contest.finalTotal*contest.teamFourAmount/contest.totalAmount.teamFour - (contest.finalTotal*contest.teamFourAmount/contest.totalAmount.teamFour-contest.teamFourAmount)*0.15 :  0.85*contest.finalTotal*contest.teamFourAmount/contest.totalAmount.teamFour || 0
                    
                    })
                }else if(player.contestTeam === 5){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamFiveAmount,
                        totalAmount:contest.totalAmount.teamFive,
                        // totalPlayerCount:_.uniqBy(contest.teamFive,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamFive ? contest.finalTotal/contest.totalAmount.teamFive : 0.85*contest.finalTotal/contest.totalAmount.teamFive || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamFive  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamFive  ? contest.finalTotal*contest.teamFiveAmount/contest.totalAmount.teamFive - (contest.finalTotal*contest.teamFiveAmount/contest.totalAmount.teamFive-contest.teamFiveAmount)*0.15 : 0.85*contest.finalTotal*contest.teamFiveAmount/contest.totalAmount.teamFive || 0,  
                    
                    })
                }else if(player.contestTeam === 6){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamSixAmount,
                        totalAmount:contest.totalAmount.teamSix,
                        // totalPlayerCount:_.uniqBy(contest.teamSix,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamSix ? contest.finalTotal/contest.totalAmount.teamSix : 0.85*contest.finalTotal/contest.totalAmount.teamSix || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamSix  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamSix  ? contest.finalTotal*contest.teamSixAmount/contest.totalAmount.teamSix - (contest.finalTotal*contest.teamSixAmount/contest.totalAmount.teamSix-contest.teamSixAmount)*0.15 :  0.85*contest.finalTotal*contest.teamSixAmount/contest.totalAmount.teamSix || 0
                    
                    })
                }else if(player.contestTeam === 7){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamSevenAmount,
                        totalAmount:contest.totalAmount.teamSeven,
                        // totalPlayerCount:_.uniqBy(contest.teamSeven,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamSeven ? contest.finalTotal/contest.totalAmount.teamSeven : 0.85*contest.finalTotal/contest.totalAmount.teamSeven || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamSeven  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamSeven  ? contest.finalTotal*contest.teamSevenAmount/contest.totalAmount.teamSeven - (contest.finalTotal*contest.teamSevenAmount/contest.totalAmount.teamSeven-contest.teamSevenAmount)*0.15 : 0.85*contest.finalTotal*contest.teamSevenAmount/contest.totalAmount.teamSeven || 0, 
                    
                    })
                }else if(player.contestTeam === 8){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamEightAmount,
                        totalAmount:contest.totalAmount.teamEight,
                        // totalPlayerCount:_.uniqBy(contest.teamEight,"req.user.id").length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamEight ? contest.finalTotal/contest.totalAmount.teamEight : 0.85*contest.finalTotal/contest.totalAmount.teamEight || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamEight  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamEight  ? contest.finalTotal*contest.teamEightAmount/contest.totalAmount.teamEight - (contest.finalTotal*contest.teamEightAmount/contest.totalAmount.teamEight-contest.teamEightAmount)*0.15 : 0.85*contest.finalTotal*contest.teamEightAmount/contest.totalAmount.teamEight || 0, 
                    
                    })
                }
            })
            sortedContest.push({_id:contest._id,
                totalAmount:contest.totalAmount,
                type:contest.type,
                typeName:contest.typeName,
                teams:playerIds,
                matchId:contest.matchId,
                finalTotal:contest.finalTotal*0.85,
                contestName:contest.contestName})
        })

        res.status(200).json({data:[{_id:2,contest:sortedContest},{_id:1,contest:arr2}]})
    })
}

module.exports = get