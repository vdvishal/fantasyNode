const mongoose = require('mongoose');
const Contest = mongoose.model('CustomContest');


const get = async (req, res) => {
    Contest.find({
        matchId: parseInt(req.params.matchId),
        open: true,
        $and: [            
                {
                    amount: {  $gte: parseInt(req.query.min)}
                },
                {
                    amount: {  $lte: parseInt(req.query.max)}
                },
            ]
        ,
        contestType: parseInt(req.query.contestType)
    }).skip((req.query.page - 1)*50).limit(50).then(response => res.status(200).json({ data: response }))
        .catch(err =>{
            console.log(err);
            
            res.status(502).json({ message: "Database error" })})
}


module.exports = get