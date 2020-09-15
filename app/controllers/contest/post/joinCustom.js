const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const Orders = mongoose.model('Orders');
const Users = mongoose.model('Users');
const FantasyPlayer = mongoose.model('FantasyPlayer');

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

 

        console.log(req.body);
        

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


        if (contestData.amount * 1 <= userDetails.wallet.bonus) {
            if (userDetails.wallet.balance >= contestData.amount - contestData.amount * 1) {
                bonus = contestData.amount * 1;
                balance = contestData.amount - contestData.amount * 1;
            } else {
                return res.status(202).json({ message: "Not enough balance." })
            }
        }

        if (contestData.amount * 1 > userDetails.wallet.bonus) {
            if (userDetails.wallet.balance >= contestData.amount - userDetails.wallet.bonus) {
                bonus = userDetails.wallet.bonus;
                balance = contestData.amount - userDetails.wallet.bonus;
            }

            if (userDetails.wallet.balance + userDetails.wallet.bonus < contestData.amount) {
                return res.status(202).json({ message: "Not enough balance." })
            }
        }

        if (userDetails.wallet.bonus === 0 && userDetails.wallet.balance < contestData.amount) {
            return res.status(202).json({ message: "Not enough balance." })
        }

        if (bonus === 0 && balance === 0) {
            balance = contestData.amount
        }

        let response = await FantasyPlayer.findOne({matchId:parseInt(contestData.matchId)}).populate('matchDetail').lean().sort({_id:-1}).then(response => response)
 
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

        let order1 = {
            "amount": parseFloat(contestData.amount) * 100,
            "status": "contest_debit",
            "orderId": 'Custom Duels',
            "matchId": parseInt(contestData.matchId),
            "contestType": req.body.contestType,
            "notes": {
                "userId": req.user.id.toString()
            }
        }
 

        Orders.insertMany([
            order1
        ]).then(response => response)


        await Contest.updateOne({
            _id: mongoose.mongo.ObjectId(req.body.contestId),
        }, obj).then(response => response)

        await Users.updateOne({ _id: req.user.id }, {
            $addToSet: {
                joinedMatch: parseInt(contestData.matchId)
            },
            $inc: {
                "wallet.balance": -parseFloat(balance),
                "wallet.bonus": -parseFloat(bonus)
            }
        }).then(respo => res.status(200).json({ message: "Contest Joined" }))

    } catch (error) {
        console.log(error);

        res.status(502).json({
            message: "Database Error!"
        })
    }


}



module.exports = joinCustom