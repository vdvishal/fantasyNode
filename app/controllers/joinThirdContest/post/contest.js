const mongoose = require('mongoose');
const MatchUpContest = mongoose.model('MatchUpContest');
const Users = mongoose.model('Users');
const Orders = mongoose.model('Orders');

/**
 * 
 * @payload {*} req  
    matchId -  ""
    selectedPlayers - [{}]
 * @payload {*} res 
 */

const post = async (req, res) => {
    let dt = req.body

    const userDetails = await Users.findById(req.user.id)
        .select('wallet')
        .lean()
        .exec()
        .then(response => response)
        .catch(err => res.status(500).json("Error try again later"));
     
    if(userDetails.wallet.balance < req.body.amount){
        return res.status(202).json({message:"Not enough balance."})
    }

    Object.entries(dt.selectedTeam).forEach(([key,value]) => {
        dt.selectedTeam[key].contestId = mongoose.mongo.ObjectID(dt.selectedTeam[key].contestId)
    })    
    
    const contest = new MatchUpContest({userId:req.user.id,...req.body})

    await contest.save().then(response => response).catch(resd => res.status(500).send({message:"Error try again later"}))

    let order = new Orders({
        "amount" : req.body.amount*100,
        "status" : "contest_debit",
        "orderId": "Combo Matchups",
        "notes" : {
            "userId" : req.user.id
        }
    })

    order.save().then().catch()
    
    await Users.updateOne({_id:req.user.id},{
        $inc:{
            "wallet.balance":-parseFloat(req.body.amount)
        }
    }).then(respo => res.status(200).json({message:"Contest Joined"}))
    
}


module.exports = post