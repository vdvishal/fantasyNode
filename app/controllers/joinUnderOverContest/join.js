const mongoose = require('mongoose');
const UnderOverContest = mongoose.model('UnderOverContest');
const Users = mongoose.model('Users');
const Orders = mongoose.model('Orders');
const Matches = mongoose.model('Matches');
const moment = require('moment');
/**
 * 
 * @payload {*} req  
    matchId -  ""
    selectedPlayers - [{}]
 * @payload {*} res 
 */

const post = async (req, res) => {    
    let dt = req.body
    let bonus = 0;
    let balance = 0;

     
    const MatchDetails = await Matches.findOne({id:parseInt(req.body.matchId)}).lean()
    .exec()
    .then(response => response)
    .catch(err => res.status(500).json("Error try again later"));

    if(moment(MatchDetails.starting_at).unix() < moment().unix() ){
        return res.status(202).json({message:"Match has already begun."})
    }
    
    if(req.body.amount === 0 || isNaN(req.body.amount)){
        return res.status(400).json({message:"Amount cannot be zero"})
    }

    const userDetails = await Users.findById(req.user.id)
    .select('wallet')
    .lean()
    .exec()
    .then(response => response)
    .catch(err => res.status(500).json("Error try again later"));
 


    if(req.body.amount*0.2 <= userDetails.wallet.bonus){
        if(userDetails.wallet.balance >= req.body.amount - req.body.amount*0.2){
            bonus = req.body.amount*0.2;
            balance = req.body.amount - req.body.amount*0.2;
        }else{
            return res.status(202).json({message:"Not enough balance."})
        }
    }

    if(req.body.amount*0.2 > userDetails.wallet.bonus){
        if(userDetails.wallet.balance >= req.body.amount - userDetails.wallet.bonus){
            bonus = userDetails.wallet.bonus;
            balance = req.body.amount - userDetails.wallet.bonus;
        }

        if(userDetails.wallet.balance + userDetails.wallet.bonus < req.body.amount ){
            return res.status(202).json({message:"Not enough balance."})
        }
    }

    if(userDetails.wallet.bonus === 0 && userDetails.wallet.balance < req.body.amount){
        return res.status(202).json({message:"Not enough balance."})
    }

    if(bonus === 0 && balance === 0){
        balance = req.body.amount
    }


    Object.entries(dt.selectedTeam).forEach(([key,value]) => {
        dt.selectedTeam[key].contestId = mongoose.mongo.ObjectID(dt.selectedTeam[key].contestId)
    })

    const contest = new UnderOverContest({userId:req.user.id,...dt})

    await contest.save().then(response => response).catch(err => res.status(500).json("Error try again later"));

    let order = new Orders({
        "amount" :  parseInt(req.body.amount)*100,
        "status" : "contest_debit",
        "matchId": parseInt(req.body.matchId),
        "contestType": 1,
        "orderId": "Under/Over",
        "notes" : {
            "userId" : req.user.id
        }
    })

    order.save().then().catch()

    await Users.updateOne({_id:req.user.id},{
        $push:{
            joinedMatch: parseInt(req.body.matchId)
        },
        $inc:{
            "wallet.balance":-parseFloat(balance),
            "wallet.bonus":-parseFloat(bonus)
 
        }
    }).then(respo => res.status(200).json({message:"Contest Joined"}))
}


module.exports = post