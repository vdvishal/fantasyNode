const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const Orders = mongoose.model('Orders');
const Users = mongoose.model('Users');
const FantasyPlayer = mongoose.model('FantasyPlayer');
var client = require('../../../libraries/mqtt')
 const { check, validationResult } = require('express-validator')
const
    validator = [
        check('contestId').isMongoId(),
        check('playerId').isInt().toInt().optional(),
    ]
/**
 * 
 * @param {*} req
 *                _id,matchId,contestId
 *  
 * @param {*} res 
 */
 



 
 



const joinCustom = async (req, res) => {
    let update = {}
    let bonus = 0;
    let balance = 0;

    try {

 

        
        

        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${param}: ${msg}`;
        };

        const errors = validationResult(req).formatWith(errorFormatter)

        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array() })
        }

        const userDetails = await Users.findById(req.user.id)
            .select('userName profilePic wallet')
            .lean()
            .exec()
            .then(response => response)




        const contestData = await Contest.findById(req.body.contestId).lean().exec().then(response => response)

        if(req.body.playerId === contestData.player1 && contestData.contestType === 6){
            return res.status(202).json({ message: "You can't select a player same as your opponent." })
        }


        if(userDetails.stats && userDetails.stats.waggered > 100){
            if(contestData.amount*0.5 <= userDetails.wallet.bonus){
                if(userDetails.wallet.balance >= contestData.amount - contestData.amount*0.5){
                    bonus = contestData.amount*0.5;
                    balance = contestData.amount - contestData.amount*0.5;
                }else{
                    return res.status(202).json({message:"Not enough balance."})
                }
            }
    
            if(contestData.amount*0.5 > userDetails.wallet.bonus){
                if(userDetails.wallet.balance >= contestData.amount - userDetails.wallet.bonus){
                    bonus = userDetails.wallet.bonus;
                    balance = contestData.amount - userDetails.wallet.bonus;
                }
        
                if(userDetails.wallet.balance + userDetails.wallet.bonus < contestData.amount ){
                    return res.status(202).json({message:"Not enough balance."})
                }
            }
        
            if(userDetails.wallet.bonus === 0 && userDetails.wallet.balance < contestData.amount){
                return res.status(202).json({message:"Not enough balance."})
            }
        }else{
            if(contestData.amount*1 <= userDetails.wallet.bonus){
                if(userDetails.wallet.balance >= contestData.amount - contestData.amount*1){
                    bonus = contestData.amount*1;
                    balance = contestData.amount - contestData.amount*1;
                }else{
                    return res.status(202).json({message:"Not enough balance."})
                }
            }
    
            if(contestData.amount*1 > userDetails.wallet.bonus){
                if(userDetails.wallet.balance >= contestData.amount - userDetails.wallet.bonus){
                    bonus = userDetails.wallet.bonus;
                    balance = contestData.amount - userDetails.wallet.bonus;
                }
        
                if(userDetails.wallet.balance + userDetails.wallet.bonus < contestData.amount ){
                    return res.status(202).json({message:"Not enough balance."})
                }
            }
        
            if(userDetails.wallet.bonus === 0 && userDetails.wallet.balance < contestData.amount){
                return res.status(202).json({message:"Not enough balance."})
            }
        }

        if (bonus === 0 && balance === 0) {
            balance = contestData.amount
        }

        let response = await FantasyPlayer.findOne({matchId:parseInt(contestData.matchId)}).populate('matchDetail').lean().sort({_id:-1}).then(response => response)
 
        players = {
            ...response.players[response.localTeam],
            ...response.players[response.visitorTeam]
            }

            if(contestData.contestType === 6 && players[req.body.playerId] === undefined){
                return res.status(202).json({ message: "Please select a player" })
            }

        let obj;

        if (contestData.contestType === 5) {
            obj = {
                $set: {
                    handicap:mongoose.mongo.ObjectId(req.user.id),
                    "users.player2": mongoose.mongo.ObjectId(req.user.id),
                    "userInfo.player2": {
                        userName: userDetails.userName,
                        profilePic: userDetails.profilePic
                    },
                    open: false
                }
            }
        }

        if (contestData.contestType === 6) {
            obj = {
                $set: {
                    handicap:mongoose.mongo.ObjectId(req.user.id),
                    player2: req.body.playerId,
                    player2Detail: {...players[req.body.playerId],teamInfo:players[req.body.playerId].teamId === response.localTeam ? response.matchDetail[0].localteam : response.matchDetail[0].visitorteam},
                    open: false,
                    "users.player2": mongoose.mongo.ObjectId(req.user.id),
                    "userInfo.player2": {
                        userName: userDetails.userName,
                        profilePic: userDetails.profilePic
                    },
                }
            }
        }





        const check = await Contest.findOneAndUpdate({
            _id: mongoose.mongo.ObjectId(req.body.contestId),
            open: true
        }, obj).then(response => response)

         if(check === null){
            return res.status(202).json({ message: "Contest full, Join another contest" })
        }

        mqtt_publish(contestData.matchId+"reload",`${contestData.contestType}`,{qos:1})


        let order1 = {
            "amount": parseFloat(contestData.amount) * 100,
            "status": "contest_debit",
            "orderId": 'Join custom duel',
            "matchId": parseInt(contestData.matchId),
            "contestType": contestData.contestType,
            "notes": {
                "userId": req.user.id.toString()
            }
        }
 

            Orders.insertMany([
                order1
            ]).then(response => response)


        await Users.updateOne({ _id: req.user.id }, {
            $addToSet: {
                joinedMatch: parseInt(contestData.matchId)
            },
            $inc: {
                "wallet.balance": -parseFloat(balance),
                "wallet.bonus": -parseFloat(bonus),
                "stats.waggered":parseFloat(contestData.amount),
                "stats.loss":parseFloat(contestData.amount)
            }
        }).then(respo => res.status(200).json({ message: "Contest Joined" }))

    } catch (error) {
        console.log('error: ', error);
        

        res.status(502).json({
            message: "Database Error!"
        })
    }


}

function mqtt_publish(topic, message, options) {
    console.log('topic: ', topic);
    console.log('message: ', message);
        
    
    client.publish(topic, message, { qos: (options.qos) ? options.qos : 0 },(err,res) => {
        console.log(res);
        
    })
}

module.exports = joinCustom