const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const Orders = mongoose.model('Orders');
const Users = mongoose.model('Users');

const { check, validationResult } = require('express-validator')
const
    validator = [
        check('matchId').isNumeric(),
        check('contestId').isMongoId(),
        check('contestType').isNumeric(),
        check('playerId').isNumeric().optional(),
        check('playerDetail').isJSON().optional(),


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

        if (req.body.contestType < 5 && req.body.contestType > 6) {
            return res.status(202).json({ message: "Wrong contest type" })
        }

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




        const contestData = await Contest.findById(req.body.contestId).exec().lean().then(response => response)

        if (contestData.amount * 0.2 <= userDetails.wallet.bonus) {
            if (userDetails.wallet.balance >= contestData.amount - contestData.amount * 0.2) {
                bonus = contestData.amount * 0.2;
                balance = contestData.amount - contestData.amount * 0.2;
            } else {
                return res.status(202).json({ message: "Not enough balance." })
            }
        }

        if (contestData.amount * 0.2 > userDetails.wallet.bonus) {
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

        let obj;

        if (req.body.contestType === 5) {
            obj = {
                $set: {
                    users: {
                        player1: contestData.users.player1,
                        player2: mongoose.mongo.ObjectId(req.user.id),
                    },
                    userInfo: {
                        player1: contestData.userInfo.player1,
                        player2: {
                            userName: userDetails.userName,
                            profilePic: userDetails.profilePic
                        },
                    },
                    open: false
                }
            }
        }

        if (req.body.contestType === 6) {
            obj = {
                $set: {

                    player2: req.body.playerId,
                    player2Detail: req.body.playerDetail,
                    open: false,
                    users: {
                        player1: contestData.users.player1,
                        player2: mongoose.mongo.ObjectId(req.user.id),
                    },
                    userInfo: {
                        player1: contestData.userInfo.player1,
                        player2: {
                            userName: userDetails.userName,
                            profilePic: userDetails.profilePic
                        },
                    },
                }
            }
        }

        let order1 = {
            "amount": parseFloat(contestData.amount) * 100,
            "status": "contest_debit",
            "orderId": req.body.contestType === 5 ? 'User Duels: Under or Over' : 'User Duels: Duels',
            "matchId": parseInt(contestData.matchId),
            "contestType": req.body.contestType,
            "notes": {
                "userId": req.user.id
            }
        }

        let order2 = {
            "amount": parseFloat(contestData.amount) * 100,
            "status": "contest_debit",
            "orderId": req.body.contestType === 5 ? 'User Duels: Under or Over' : 'User Duels: Duels',
            "matchId": parseInt(contestData.matchId),
            "contestType": req.body.contestType,
            "notes": {
                "userId": contestData.users.player1
            }
        }

        Orders.insertMany([
            order1, order2
        ]).then(response => response)


        await Contest.updateOne({
            _id: mongoose.mongo.ObjectId(req.body.contestId),
            matchId: req.body.matchId
        }, obj).then(response => response)

        await Users.updateOne({ _id: req.user.id }, {
            $addToSet: {
                joinedMatch: parseInt(req.body.matchId)
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