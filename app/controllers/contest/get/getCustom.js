const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');


const get = async (req, res) => {
    console.log(req.query);

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
    }).skip((parseInt(req.query.page) - 1) * 50).limit(50).then(response => res.status(200).json({ data: response, pages: Math.ceil(count / 50) }))
        .catch(err => {
            console.log(err);

            res.status(502).json({ message: "Database error" })
        })
}


module.exports = get