const mongoose = require('mongoose');
const match = mongoose.model('Matches');
const Contest = mongoose.model('Contest');

const moment = require('moment')
 

const get = (req, res) => {
    Contest.aggregate([
        {
            $match:{
                status:{$ne:"notstarted"},
                // featured:true, 
            }
        },
        {
            $project: {
                _id:1,
                contestInfo:1,
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
                            cond: {$eq: ['$$teamOne.userId', 'userId']}
                        }
                    },
               'teamTwo':1,
                'teamTwoAmount': {$filter: {
                    input: '$teamTwo',
                    as: 'teamTwo',
                    cond: {$eq: ['$$teamTwo.userId', 'userId']}
                },
                },
               'teamThree':1,
                'teamThreeAmount': {$filter: {
                    input: '$teamThree',
                    as: 'teamThree',
                    cond: {$eq: ['$$teamThree.userId', 'userId']}
                },
                },
                'teamFour':1,
                'teamFourAmount': {$filter: {
                    input: '$teamFour',
                    as: 'teamFour',
                    cond: {$eq: ['$$teamFour.userId', 'userId']}
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
                contestInfo:1,
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
        console.log(response);
        
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
                if(player.contestteam === 1){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamOneAmount,
                        totalAmount:contest.totalAmount.teamOne,
                        totalPlayerCount:_.uniqBy(contest.teamOne,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamOne ? contest.finalTotal/contest.totalAmount.teamOne : 0.85*contest.finalTotal/contest.totalAmount.teamOne || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamOne  ? contest.finalTotal : contest.finalTotal*0.85 || 0 ,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamOne  ? contest.finalTotal*contest.teamOneAmount/contest.totalAmount.teamOne - (contest.finalTotal*contest.teamOneAmount/contest.totalAmount.teamOne-contest.teamOneAmount)*0.15 : 0.85*contest.finalTotal*contest.teamOneAmount/contest.totalAmount.teamOne || 0   
                    })
                }else if(player.contestteam === 2){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamTwoAmount,
                        totalAmount:contest.totalAmount.teamTwo,
                        totalPlayerCount:_.uniqBy(contest.teamTwo,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamTwo ? contest.finalTotal/contest.totalAmount.teamTwo : 0.85*contest.finalTotal/contest.totalAmount.teamTwo || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamTwo  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamTwo  ? contest.finalTotal*contest.teamTwoAmount/contest.totalAmount.teamTwo - (contest.finalTotal*contest.teamTwoAmount/contest.totalAmount.teamTwo-contest.teamTwoAmount)*0.15 : 0.85*contest.finalTotal*contest.teamTwoAmount/contest.totalAmount.teamTwo || 0,  
                    
                    })
                }else if(player.contestteam === 3){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamThreeAmount,
                        totalAmount:contest.totalAmount.teamThree,
                        totalPlayerCount:_.uniqBy(contest.teamThree,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamThree ? contest.finalTotal/contest.totalAmount.teamThree : 0.85*contest.finalTotal/contest.totalAmount.teamThree || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamThree  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamThree  ? contest.finalTotal*contest.teamThreeAmount/contest.totalAmount.teamThree - (contest.finalTotal*contest.teamThreeAmount/contest.totalAmount.teamThree-contest.teamThreeAmount)*0.15 : 0.85*contest.finalTotal*contest.teamThreeAmount/contest.totalAmount.teamThree || 0, 
                    
                    })
                }else if(player.contestteam === 4){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamFourAmount,
                        totalAmount:contest.totalAmount.teamFour,
                        totalPlayerCount:_.uniqBy(contest.teamFour,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamFour ? contest.finalTotal/contest.totalAmount.teamFour : 0.85*contest.finalTotal/contest.totalAmount.teamFour || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamFour  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamFour  ? contest.finalTotal*contest.teamFourAmount/contest.totalAmount.teamFour - (contest.finalTotal*contest.teamFourAmount/contest.totalAmount.teamFour-contest.teamFourAmount)*0.15 :  0.85*contest.finalTotal*contest.teamFourAmount/contest.totalAmount.teamFour || 0
                    
                    })
                }else if(player.contestteam === 5){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamSixAmount,
                        totalAmount:contest.totalAmount.teamSix,
                        totalPlayerCount:_.uniqBy(contest.teamSix,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamSix ? contest.finalTotal/contest.totalAmount.teamSix : 0.85*contest.finalTotal/contest.totalAmount.teamSix || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamSix  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamSix  ? contest.finalTotal*contest.teamSixAmount/contest.totalAmount.teamSix - (contest.finalTotal*contest.teamSixAmount/contest.totalAmount.teamSix-contest.teamSixAmount)*0.15 :  0.85*contest.finalTotal*contest.teamSixAmount/contest.totalAmount.teamSix || 0
                    
                    })
                }else if(player.contestteam === 6){
                    playerIds.push({
                        ...player,
                        userAmount:contest.purpleteamAmount,
                        totalAmount:contest.totalAmount.purpleteam,
                        totalPlayerCount:_.uniqBy(contest.purpleteam,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.purpleteam ? contest.finalTotal/contest.totalAmount.purpleteam : 0.85*contest.finalTotal/contest.totalAmount.purpleteam || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.purpleteam  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.purpleteam  ? contest.finalTotal*contest.purpleteamAmount/contest.totalAmount.purpleteam - (contest.finalTotal*contest.purpleteamAmount/contest.totalAmount.purpleteam-contest.purpleteamAmount)*0.15 :  0.85*contest.finalTotal*contest.purpleteamAmount/contest.totalAmount.purpleteam || 0
                    
                    })
                }else if(player.contestteam === 7){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamSevenAmount,
                        totalAmount:contest.totalAmount.teamSeven,
                        totalPlayerCount:_.uniqBy(contest.teamSeven,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamSeven ? contest.finalTotal/contest.totalAmount.teamSeven : 0.85*contest.finalTotal/contest.totalAmount.teamSeven || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamSeven  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamSeven  ? contest.finalTotal*contest.teamSevenAmount/contest.totalAmount.teamSeven - (contest.finalTotal*contest.teamSevenAmount/contest.totalAmount.teamSeven-contest.teamSevenAmount)*0.15 : 0.85*contest.finalTotal*contest.teamSevenAmount/contest.totalAmount.teamSeven || 0, 
                    
                    })
                }else if(player.contestteam === 8){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamEightAmount,
                        totalAmount:contest.totalAmount.teamEight,
                        totalPlayerCount:_.uniqBy(contest.teamEight,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamEight ? contest.finalTotal/contest.totalAmount.teamEight : 0.85*contest.finalTotal/contest.totalAmount.teamEight || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamEight  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamEight  ? contest.finalTotal*contest.teamEightAmount/contest.totalAmount.teamEight - (contest.finalTotal*contest.teamEightAmount/contest.totalAmount.teamEight-contest.teamEightAmount)*0.15 : 0.85*contest.finalTotal*contest.teamEightAmount/contest.totalAmount.teamEight || 0, 
                    
                    })
                }else if(player.contestteam === 9){
                    playerIds.push({
                        ...player,
                        userAmount:contest.teamFiveAmount,
                        totalAmount:contest.totalAmount.teamFive,
                        totalPlayerCount:_.uniqBy(contest.teamFive,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.teamFive ? contest.finalTotal/contest.totalAmount.teamFive : 0.85*contest.finalTotal/contest.totalAmount.teamFive || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.teamFive  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.teamFive  ? contest.finalTotal*contest.teamFiveAmount/contest.totalAmount.teamFive - (contest.finalTotal*contest.teamFiveAmount/contest.totalAmount.teamFive-contest.teamFiveAmount)*0.15 : 0.85*contest.finalTotal*contest.teamFiveAmount/contest.totalAmount.teamFive || 0,  
                    
                    })
                }else if(player.contestteam === 10){
                    playerIds.push({
                        ...player,
                        userAmount:contest.greyteamAmount,
                        totalAmount:contest.totalAmount.greyteam,
                        totalPlayerCount:_.uniqBy(contest.greyteam,'userId').length,
                        multiplier:0.85*contest.finalTotal < contest.totalAmount.greyteam ? contest.finalTotal/contest.totalAmount.greyteam : 0.85*contest.finalTotal/contest.totalAmount.greyteam || 0,  
                        prize: 0.85*contest.finalTotal < contest.totalAmount.greyteam  ? contest.finalTotal : contest.finalTotal*0.85 || 0,   
                        payout: 0.85*contest.finalTotal < contest.totalAmount.greyteam  ? contest.finalTotal*contest.greyteamAmount/contest.totalAmount.greyteam - (contest.finalTotal*contest.greyteamAmount/contest.totalAmount.greyteam-contest.greyteamAmount)*0.15 : 0.85*contest.finalTotal*contest.greyteamAmount/contest.totalAmount.greyteam || 0,   
                    
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
                contestInfo:contest.contestInfo,
                contestName:contest.contestName})
        })

        let sortedContest2 = []
        arr2.forEach(contest => {
             sortedContest2.push({_id:contest._id,
                totalAmount:contest.totalAmount || 0,
                type:contest.type,
                typeName:contest.typeName,
                playerInfo:contest.playerInfo,
                teams:[],
                teamOnePlayerCount:_.uniqBy(contest.teamOne,'userId').length,
                teamTwoPlayerCount:_.uniqBy(contest.teamTwo,'userId').length,
                teamThreePlayerCount:_.uniqBy(contest.teamThree,'userId').length,
                teamOneAmount:contest.teamOneAmount || 0,
                teamOnePayout:(contest.totalAmount.teamOne+contest.totalAmount.teamTwo+contest.totalAmount.teamThree)*contest.teamOneAmount/contest.totalAmount.teamOne || 0,
                teamTwoAmount:contest.teamTwoAmount || 0,
                teamTwoPayout:(contest.totalAmount.teamOne+contest.totalAmount.teamTwo+contest.totalAmount.teamThree)*contest.teamTwoAmount/contest.totalAmount.teamTwo || 0,
                teamThreeAmount:contest.teamThreeAmount || 0,
                teamThreePayout:(contest.totalAmount.teamOne+contest.totalAmount.teamTwo+contest.totalAmount.teamThree)*contest.teamThreeAmount/contest.totalAmount.teamThree || 0,
                value1:contest.value1,
                value2: contest.value2,
                matchId:contest.matchId,
                finalTotal:0,
                contestInfo:contest.contestInfo,
                contestName:contest.contestName})
        })
        if(req.query.matchId !== 'undefined'){
            console.log(req.query.matchId);

            match.findOne({id:parseInt(req.query.matchId)}).exec().then(result => 
                res.status(200).json({match:result,featured:[{_id:2,contest:sortedContest},{_id:1,contest:sortedContest2}]}))
            .catch(err => res.status(500).json(err))
        }else{
            console.log("req.query.matchId");

            match.find({}).exec().then(result => 
                res.status(200).json({match:result,featured:[{_id:2,contest:sortedContest},{_id:1,contest:sortedContest2}]}))
            .catch(err => res.status(500).json(err))
        }
 
     })


}


module.exports = get