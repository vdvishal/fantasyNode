const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');

/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100         
 *  
 * @param {*} res 
 */


const joinCustom = async (req, res) => {
    let update = {}

    const contestData = await Contest.findById(data).exec().lean().then(response =>response)
    
    let obj;

    if(contestData.minAmount > req.body.amount){
        return res.status(202).json({message:"Amount must be greater than the minimum amount"})
    }

    if(req.body.contestType === 5){
        obj = {
                $set:{
                    matchId: req.body.matchId,
                    minAmount:req.body.minAmount,
                    maxAmount:req.body.maxAmount,
                    users:{
                        player1: contestData.users.player1, 
                        player2:mongoose.mongo.ObjectId(req.user.id),
                    },
                    finalAmount:req.body.amount,
                    totalAmount:req.body.amount*2*0.05
            }
        }
    }

    if(req.body.contestType === 6){
        obj = {
                $set:{
 
                    player2:req.body.playerId,
                    player2Detail: req.body.player2Detail,
                    matchId: req.body.matchId,
 
                    users:{
                        player1:contestData.users.player1,
                        player2: mongoose.mongo.ObjectId(req.user.id),
                    },
                    finalAmount:req.body.amount,
                    totalAmount:req.body.amount*2*0.05
            }
        }
    }

    
}

 

module.exports = joinCustom