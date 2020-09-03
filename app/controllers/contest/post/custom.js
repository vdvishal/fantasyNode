const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');
const Users = mongoose.model('Users');
const { check, validationResult } = require('express-validator')
const
    validator = [
        check('matchId').isNumeric(),
        check('contestType').isNumeric(),
        check('playerId').isNumeric(),
        check('playerDetail').isJSON(),
        check('amount').isNumeric().not(0).toFloat(),
        check('value').isNumeric().toFloat(),
        check('subType').isNumeric(),



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

    try {



        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${param}: ${msg}`;
        };

        const errors = validationResult(req).formatWith(errorFormatter)

        if (!errors.isEmpty()) {
            return res.status(422).json({ message: errors.array() })
        }

        if (req.body.contestType < 5 && req.body.contestType > 6) {
            return res.status(202).json({ message: "Wrong contest type" })
        }

        const userDetails = await Users.findById(req.user.id)
            .select('userName profilePic wallet')
            .lean()
            .exec()
            .then(response => response)

        if (req.body.amount * 0.2 <= userDetails.wallet.bonus) {
            if (userDetails.wallet.balance >= req.body.amount - req.body.amount * 0.2) {
                bonus = req.body.amount * 0.2;
                balance = req.body.amount - req.body.amount * 0.2;
            } else {
                return res.status(202).json({ message: "Not enough balance." })
            }
        }

        if (req.body.amount * 0.2 > userDetails.wallet.bonus) {
            if (userDetails.wallet.balance >= req.body.amount - userDetails.wallet.bonus) {
                bonus = userDetails.wallet.bonus;
                balance = req.body.amount - userDetails.wallet.bonus;
            }

            if (userDetails.wallet.balance + userDetails.wallet.bonus < req.body.amount) {
                return res.status(202).json({ message: "Not enough balance." })
            }
        }

        if (userDetails.wallet.bonus === 0 && userDetails.wallet.balance < req.body.amount) {
            return res.status(202).json({ message: "Not enough balance." })
        }

        if (bonus === 0 && balance === 0) {
            balance = req.body.amount
        }


        if (req.body.contestType === 5) {
            obj = new Contest({
                contestName: 'Under or Over',
                contestType: 5,
                playerId: req.body.playerId,
                playerDetail: req.body.playerDetail,
                value: req.body.value,
                type: req.body.type,
                typeName: req.body.type === '1' ? 'Runs' : req.body.type === '2' ? "Wickets" : "Fantasy Points",
                info: {
                    player1: req.body.subType === 1 ? `Under ${req.body.value}` : `Over ${req.body.value}`,
                    player2: req.body.subType === 1 ? `Over ${req.body.value}` : `Under ${req.body.value}`,
                },
                player1: req.body.subType === 1 ? 1 : 2,
                player2: req.body.subType === 1 ? 2 : 1,
                handicap: mongoose.mongo.ObjectId(req.user.id),
                matchId: req.body.matchId,

                users: {
                    player1: mongoose.mongo.ObjectId(req.user.id),
                    player2: ''
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
                player1Detail: req.body.playerDetail,
                player2Detail: '',
                handicap: mongoose.mongo.ObjectId(req.user.id),
                matchId: req.body.matchId,
                users: {
                    player1: mongoose.mongo.ObjectId(req.user.id),
                    player2: ''
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



        await obj.save().then(response => {
            res.status(200).json({ message: "Contest Created" })
        })

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


module.exports = custom