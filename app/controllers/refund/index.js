const mongoose = require('mongoose');
require('../../models/contest')
let FantasyContest = mongoose.model('FantasyContest');
let MatchUpContest = mongoose.model('MatchUpContest');
let UnderOverContest = mongoose.model('UnderOverContest');
let UnderOverContest2 = mongoose.model('UnderOverContestType2');

let Users = mongoose.model('Users');
let CustomContest = mongoose.model('CustomContest');
let FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
let Orders = mongoose.model('Orders');


const moment = require('moment')


const post = async (req, res) => {
    let count = 0
    await MatchUpContest.find({ matchId: parseInt(req.body.matchId) })
    
        .lean()
        .cursor()
        .eachAsync(async function (doc, i) {
            await Users.updateOne({
                _id: mongoose.mongo.ObjectID(doc.userId.toString())
            }, {
                $inc: {
                    "wallet.balance": doc.amount
                }
            }).then().catch()

            let order1 = new Orders({
                "amount": doc.amount * 100,
                "status": "contest_credit",
                "matchId": req.body.matchId,
                "contestType": 3,
                "orderId": "Combo Duels Refund: Contest Cancelled ",
                "notes": {
                    "userId": doc.userId.toString()
                }
            })

            await order1.save().then()

        }).then()

        console.log('MatchUpContest: ');

    await UnderOverContest.find({ matchId: parseInt(req.body.matchId) })
        .lean()
        .cursor()
        .eachAsync(async function (doc, i) {
            await Users.updateOne({
                _id: mongoose.mongo.ObjectID(doc.userId.toString())
            }, {
                $inc: {
                    "wallet.balance": doc.amount
                }
            }).then().catch()

            let order1 = new Orders({
                "amount": doc.amount * 100,
                "status": "contest_credit",
                "matchId": req.body.matchId,
                "contestType": 1,
                "orderId": "Under/Over Refund: Contest Cancelled ",
                "notes": {
                    "userId": doc.userId.toString()
                }
            })

            await order1.save().then()
        }).then()
        console.log('UnderOverContest: ');

        await UnderOverContest2.find({ matchId: parseInt(req.body.matchId) })
        .lean()
        .cursor()
        .eachAsync(async function (doc, i) {
            await Users.updateOne({
                _id: mongoose.mongo.ObjectID(doc.userId.toString())
            }, {
                $inc: {
                    "wallet.balance": doc.amount
                }
            }).then().catch()

            let order1 = new Orders({
                "amount": doc.amount * 100,
                "status": "contest_credit",
                "matchId": req.body.matchId,
                "contestType": 2,
                "orderId": "Under/Over Refund: Contest Cancelled ",
                "notes": {
                    "userId": doc.userId.toString()
                }
            })

            await order1.save().then()
        }).then()
        console.log('UnderOverContest2: ');

    await CustomContest.find({ matchId: parseInt(req.body.matchId) })
        .lean()
        .cursor()
        .eachAsync(async function (doc, i) {
            await Users.updateOne({
                _id: mongoose.mongo.ObjectID(doc.users.player1.toString())
            }, {
                $inc: {
                    "wallet.balance": doc.amount
                }
            }).then().catch()

            if (doc.users.player2 !== undefined && doc.users.player2 !== null && doc.users.player2 !== '') {


                await Users.updateOne({
                    _id: mongoose.mongo.ObjectID(doc.users.player2.toString())
                }, {
                    $inc: {
                        "wallet.balance": doc.amount
                    }
                }).then().catch()



                let order2 = new Orders({
                    "amount": doc.amount * 100,
                    "status": "contest_credit",
                    "matchId": req.body.matchId,
                    "contestType": doc.contestType,
                    "orderId": "Custom Duels Refund: Contest Cancelled ",
                    "notes": {
                        "userId": doc.users.player2.toString()
                    }
                })
                await order2.save().then()
            }

            let order1 = new Orders({
                "amount": doc.amount * 100,
                "status": "contest_credit",
                "matchId": req.body.matchId,
                "contestType": doc.contestType,
                "orderId": "Custom Duels Refund: Contest Cancelled ",
                "notes": {
                    "userId": doc.users.player1.toString()
                }
            })

            await order1.save().then()

        }).then()
        console.log('CustomContest: ');

    await FantasyContest.find({ matchId: parseInt(req.body.matchId) })
        .lean()
        .cursor()
        .eachAsync(async function (doc, i) {
            console.log('doc: ', doc);

            await FantasyJoinedUsers.find({ contestId: mongoose.mongo.ObjectID(doc._id.toString()) })
                .lean()
                .cursor()
                .eachAsync(async function (doc2, i) {

                    await Users.updateOne({
                        _id: mongoose.mongo.ObjectID(doc2.userId.toString())
                    }, {
                        $inc: {
                            "wallet.balance": doc.entryFee
                        }
                    }).then()

                    let order1 = new Orders({
                        "amount": doc.entryFee * 100,
                        "status": "contest_credit",
                        "matchId": req.body.matchId,
                        "contestType": 4,
                        "orderId": "Fantasy11 Refund: Contest Cancelled ",
                        "notes": {
                            "userId": doc2.userId.toString()
                        }
                    })

                    await order1.save().then()

                }).then()



        }).then()
        console.log('FantasyContest: ');

    
    res.status(200).json({message:"Done"})

}


module.exports = post

const delay = ms => new Promise(res => setTimeout(res, ms));
