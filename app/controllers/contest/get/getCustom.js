const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');


const get = async (req, res) => {
    console.log(req.query);

    if(req.query.playerId === 'myDuel'){
        let count = await Contest.count({
            matchId: parseInt(req.params.matchId),
            open: true,
            'users.player1':  mongoose.mongo.ObjectId(req.query.sort),
            contestType: parseInt(req.query.contestType)
        }).then(response => response)
    
        await Contest.find({
            matchId: parseInt(req.params.matchId),
            open: true,
            'users.player1':  mongoose.mongo.ObjectId(req.query.sort),
            contestType: parseInt(req.query.contestType)
        }).sort({'amount': 1}).skip((parseInt(req.query.page) - 1) * 50).limit(50).then(response => res.status(200).json({ data: response, pages: Math.ceil(count / 50) }))
            .catch(err => {
                console.log(err);
    
                res.status(502).json({ message: "Database error" })
            })
    }else{ 

    let count = await Contest.count({
        matchId: parseInt(req.params.matchId),
        open: true,
        $and: [
            {
                amount: { $gte: parseInt(req.query.min) }
            },
            {
                amount: { $lte: parseInt(req.query.max) }
            },
        ]
        ,
        contestType: parseInt(req.query.contestType)
    }).then(response => response)

    await Contest.find({
        matchId: parseInt(req.params.matchId),
        open: true,
        $and: [
            {
                amount: { $gte: parseInt(req.query.min) }
            },
            {
                amount: { $lte: parseInt(req.query.max) }
            },
        ],
        $or: req.query.playerId === "all" ? [
            {
                contestType: parseInt(req.query.contestType)
            }
        ]  :  [
            {

                playerId: req.query.playerId !== "all" ? parseInt(req.query.playerId) : ''
            },
            {

                player1: req.query.playerId !== "all" ? parseInt(req.query.playerId) : ''
            }],
        contestType: parseInt(req.query.contestType)
    }).sort({'amount': 1}).skip((parseInt(req.query.page) - 1) * 50).limit(50).then(response => res.status(200).json({ data: req.query.sort === 'undefined' ? response : req.query.sort === "1" ? response : response.reverse(), pages: Math.ceil(count / 50) }))
        .catch(err => {
            console.log(err);

            res.status(502).json({ message: "Database error" })
        })

    }
}


module.exports = get