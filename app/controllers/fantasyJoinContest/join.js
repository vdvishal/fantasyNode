const mongoose = require('mongoose');
const FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
const FantasyContest = mongoose.model('FantasyContest');
const Users = mongoose.model('Users');
const Orders = mongoose.model('Orders');


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
    
    const userDetails = await Users.findById(req.user.id)
        .select('wallet')
        .lean()
        .exec()
        .then(response => response)
        .catch(err => res.status(500).json("Error try again later"));
    
    if(userDetails.wallet.balance < contestDetails.entryFee){
        return res.status(202).json({message:"Not enough balance."})
    }

    const entryCount = await FantasyJoinedUsers.find({
        contestId: mongoose.mongo.ObjectID(req.body.contestId),
        userId: mongoose.mongo.ObjectID(req.user.id),
    }).count().exec().then(response => response)

    if(contestDetails.limit <= entryCount){
       return res.status(202).json({message:"Max team limit reached"})
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
                ]).then(response =>{})
                .catch(err => res.status(500).send({message:"Error try again later"}))
        }else{
            contestDetails.totalJoined = 1;
           let newContest = await createNenterContest(contestDetails);
           req.body.contestId = newContest;
           await enterContest({...req.body,userId:req.user.id})
           
        }
    }

    let order = new Orders({
        "amount" : contestDetails.entryFee*100,
        "status" : "contest_debit",
        "orderId": "Fantasy " + contestDetails.contestName,
        "notes" : {
            "userId" : req.user.id
        }
    })

    order.save().then().catch()

    await Users.updateOne({_id:req.user.id},{
        $inc:{
            "wallet.balance":-contestDetails.entryFee
        }
    }).then(respo => res.status(200).json({message:"Contest Joined"}))
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