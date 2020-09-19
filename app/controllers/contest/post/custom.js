const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const Users = mongoose.model('Users');
const FantasyPlayer = mongoose.model('FantasyPlayer');

const Orders = mongoose.model('Orders');

const { check, validationResult } = require('express-validator')
const
    validator = [
        check('matchId').isFloat().toInt(),
        check('contestType').isFloat().toInt(),
        check('playerId').isFloat().toInt(),
        check('amount').isFloat().toFloat(),
        check('value').isFloat().toFloat().optional(),
        check('subType').isFloat().toInt().optional(),
    ]

/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100              
 *  
 * @param {*} res 
 */


const custom = async (req, res) => {
    let bonus = 0;
    let balance = 0;
    let obj
    let players;

    try {

        
 
        req.body.amount = req.body.amount.toFixed(2)
        req.body.amount = parseFloat(req.body.amount)
        

        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${param}: ${msg}`;
        };

        const errors = validationResult(req).formatWith(errorFormatter)

        
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array() })
        }

        if (req.body.amount < 10 ) {
            return res.status(202).json({ message: "Amount should be greater than ₹9.99" })
        }

        if (req.body.contestType < 5 || req.body.contestType > 6) {
            return res.status(202).json({ message: "Wrong contest type" })
        }

        const userDetails = await Users.findById(req.user.id)
            .select('userName profilePic wallet')
            .lean()
            .exec()
            .then(response => response)

            if(userDetails.stats && userDetails.stats.waggered > 100){
                if(req.body.amount*0.5 <= userDetails.wallet.bonus){
                    if(userDetails.wallet.balance >= req.body.amount - req.body.amount*0.5){
                        bonus = req.body.amount*0.5;
                        balance = req.body.amount - req.body.amount*0.5;
                    }else{
                        return res.status(202).json({message:"Not enough balance."})
                    }
                }
        
                if(req.body.amount*0.5 > userDetails.wallet.bonus){
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
            }else{
                if(req.body.amount*1 <= userDetails.wallet.bonus){
                    if(userDetails.wallet.balance >= req.body.amount - req.body.amount*1){
                        bonus = req.body.amount*1;
                        balance = req.body.amount - req.body.amount*1;
                    }else{
                        return res.status(202).json({message:"Not enough balance."})
                    }
                }
        
                if(req.body.amount*1 > userDetails.wallet.bonus){
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
            }

        if (bonus === 0 && balance === 0) {
            balance = req.body.amount
        }


        let response = await FantasyPlayer.findOne({matchId:parseInt(req.body.matchId)}).populate('matchDetail').lean().sort({_id:-1}).then(response => response)
 
        players = {
            ...response.players[response.localTeam].Allrounder,
            ...response.players[response.localTeam].Batsman,
            ...response.players[response.localTeam].Wicketkeeper,
            ...response.players[response.localTeam].Bowler,
            ...response.players[response.visitorTeam].Allrounder,
                    ...response.players[response.visitorTeam].Batsman,
                    ...response.players[response.visitorTeam].Wicketkeeper,
                    ...response.players[response.visitorTeam].Bowler,
            }

            if(players[req.body.playerId] === undefined){
                return res.status(202).json({ message: "Please select a player" })
            }

        if (req.body.contestType === 5) {
            obj = new Contest({
                contestName: 'Under or Over',
                contestType: 5,
                playerId: req.body.playerId,
                playerDetail:{...players[req.body.playerId],teamInfo:players[req.body.playerId].teamId === response.localTeam ? response.matchDetail[0].localteam : response.matchDetail[0].visitorteam},
                value: req.body.value,
                type: req.body.type,
                typeName: req.body.type === 1 ? 'Runs' : req.body.type === 2 ? "Wickets" : "Fantasy Points",
                info: {
                    player1: req.body.subType === 1 ? `Under ${req.body.value} points` : `Over ${req.body.value} points`,
                    player2: req.body.subType === 1 ? `Over ${req.body.value + 1} points` : `Under ${req.body.value + 1} points`,
                },
                player1: req.body.subType === 1 ? 1 : 2,
                player2: req.body.subType === 1 ? 2 : 1,
                
                matchId: req.body.matchId,

                users: {
                    player1: mongoose.mongo.ObjectId(req.user.id),
    
                },
                userInfo: {
                    player1: {
                        userName: userDetails.userName,
                        profilePic: userDetails.profilePic
                    },
                },
                amount: req.body.amount,
                totalAmount: req.body.amount * 2 * 0.90
            })
        }

        if (req.body.contestType === 6) {
            obj = new Contest({
                contestName: 'Duels',
                contestType: 6,
                value: '',
                type: 3,
                typeName: "Fantasy Points",
                player1: req.body.playerId,
                player2: '',
                player1Detail:{...players[req.body.playerId],teamInfo:players[req.body.playerId].teamId === response.localTeam ? response.matchDetail[0].localteam : response.matchDetail[0].visitorteam},
                player2Detail: '', 
                matchId: req.body.matchId,
                users: {
                    player1: mongoose.mongo.ObjectId(req.user.id),
                },
                userInfo: {
                    player1: {
                        userName: userDetails.userName,
                        profilePic: userDetails.profilePic
                    },
                },
                amount: req.body.amount,
                totalAmount: req.body.amount * 2 * 0.90
            })
        }



        await obj.save().then(response => {})

        let order1 = {
            "amount": parseFloat(req.body.amount) * 100,
            "status": "contest_debit",
            "orderId": 'Created custom duel',
            "matchId": parseInt(req.body.matchId),
            "contestType": req.body.contestType,
            "notes": {
                "userId": req.user.id.toString()
            }
        }
 

        Orders.insertMany([
            order1
        ]).then(response => response)

        await Users.updateOne({ _id:mongoose.mongo.ObjectId(req.user.id)}, {
            $addToSet: {
                joinedMatch: parseInt(req.body.matchId)
            },
            $inc: {
                "wallet.balance": -parseFloat(balance),
                "wallet.bonus": -parseFloat(bonus),
                "stats.waggered":parseFloat(req.body.amount),
                "stats.loss":parseFloat(req.body.amount)
            }
        }).then(respo => res.status(200).json({ message: "Contest Joined" }))


    } catch (error) {
        

        res.status(502).json({
            message: "Database Error!"
        })
    }
}


module.exports = {custom,validator}