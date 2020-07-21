const mongoose = require('mongoose');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
const FantasyContest = mongoose.model('FantasyContest');


/**
 * 
 * @payload {*} req  
    matchId -  ""
    contestId - 
    teamId - 
    userId
 * @payload {*} res 
 */

const post = async (req, res) => { 
    
    const contestDetails = await FantasyContest.findById(req.body.contestId)
        .lean()
        .exec()
        .then(response => response)
        .catch(err => res.status(500).json("Error try again later"));
    
    const entryCount = await FantasyJoinedUsers.find({
        contestId: mongoose.mongo.ObjectID(req.body.contestId),
        userId: mongoose.mongo.ObjectID(req.user.id),
    }).count().exec().then(response => response)

    if(contestDetails.limit <= entryCount){
       return res.status(202).send({message:"Max team limit reached"})
    }    

    if(contestDetails.totalSpots > contestDetails.totalJoined){
 
        await enterContest({...req.body,userId:req.user.id})
       
        await FantasyContest.updateOne({_id:req.body.contestId},
                [{ 
                    $set:{
                        totalJoined: contestDetails.totalJoined + 1,
                        isFull:  {$eq: [ contestDetails.totalSpots, contestDetails.totalJoined + 1 ] }  
                    }
                    }
                ]).then(response => response)
                .catch(err => res.status(500).send({message:"Error try again later"}))
        
        if(contestDetails.totalSpots === contestDetails.totalJoined + 1){
            contestDetails.totalJoined = 0;
            await createNenterContest({...contestDetails});
        }
        res.status(200).send({message:"Contest joined"})
    }else{
        const contest = await FantasyContest.findOne({
            totalSpots: contestDetails.totalSpots,
            isFull: false,
            matchId: contestDetails.matchId,
            entryFee: contestDetails.entryFee,
            type: contestDetails.type
        }).lean().exec()
        .then(response => response)
         if(contest !== null){
            let obj = {...req.body}
            obj.contestId = contest._id;

            await enterContest({...obj,userId:req.user.id});

            await FantasyContest.updateOne({_id:contest._id},
                [{ 
                    $set:{
                        totalJoined: contest.totalJoined + 1,
                        isFull:  {$eq: [ contest.totalSpots, contest.totalJoined + 1 ] }  
                        }
                    }
                ]).then(response => res.status(200).send({message:"Contest joined"}))
                .catch(err => res.status(500).send({message:"Error try again later"}))
        }else{
            contestDetails.totalJoined = 1;
           let newContest = await createNenterContest(contestDetails);
           req.body.contestId = newContest;
           await enterContest({...req.body,userId:req.user.id})
           res.status(200).json({message:"Contest Joined"})
        }
    }



}


const enterContest = (contest) => new Promise((resolve,reject) => {
            
    let detail = {
        matchId:contest.matchId,
        contestId: mongoose.mongo.ObjectID(contest.contestId),
        teamId: mongoose.mongo.ObjectID(contest.teamId),
        userId: mongoose.mongo.ObjectID(contest.userId), 
    }

    const contestSav = new FantasyJoinedUsers({...detail})

    contestSav.save()
            .then(response => resolve(response))
            .catch(err => reject(err));
})

const createNenterContest = (contest) => new Promise((resolve,reject) => {
            
    let detail =     {
            contestName: contest.contestName,
            type: contest.type,
            entryType: contest.entryType,
            limit: contest.limit,
            totalSpots: contest.totalSpots,
            isFull: false,
            entryFee: contest.entryFee,
            prizePool:contest.prizePool,
            prize:contest.prize,
            matchId: contest.matchId,
            totalWinners: contest.totalWinners,
            prizeBreakUp: contest.prizeBreakUp,
            contestType: contest.contestType,
            totalJoined: contest.totalJoined,
    }

    const contestSav = new FantasyContest({...detail})

    contestSav.save()
            .then(response => resolve(response._id))
            .catch()
})


module.exports = post