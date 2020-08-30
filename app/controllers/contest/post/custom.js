const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
 
/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100              
 *  
 * @param {*} res 
 */


const custom = (req, res) => {
    let team;
    let obj
    if(req.body.contestType === 5){
        obj = new Contest({
            contestName: 'Under or Over',
            contestType: 5,
            playerId:req.body.playerId,
            playerDetail: req.body.playerDetail, 
            value: req.body.value,
            type: req.body.type,
            typeName: req.body.type === '1' ? 'Runs' : req.body.type === '2' ? "Wickets" : "Fantasy Points",
            info: {
                player1:req.body.subType === 1 ? `Under ${req.body.value}` : `Over ${req.body.value}`,
                player2:req.body.subType === 1 ? `Over ${req.body.value}` : `Under ${req.body.value}`,
            },
            handicap: mongoose.mongo.ObjectId(req.user.id),
            matchId: req.body.matchId,
            minAmount:req.body.minAmount,
            maxAmount:req.body.maxAmount,
            users:{
                player1:mongoose.mongo.ObjectId(req.user.id),
                player2: '' 
            },
            finalAmount:req.body.maxAmount,
            totalAmount: req.body.maxAmount*2*0.05
        })
    }

    if(req.body.contestType === 6){
        obj = new Contest({
            contestName: 'Duels',
            contestType: 6,
            value: '',
            type: 3,
            typeName: "Fantasy Points",
            player1:req.body.playerId,
            player2:'',
            player1Detail: req.body.playerDetail,
            player2Detail: '',
            handicap: mongoose.mongo.ObjectId(req.user.id),
            matchId: req.body.matchId,
            minAmount:req.body.minAmount,
            maxAmount:req.body.maxAmount,
            users:{
                player1:mongoose.mongo.ObjectId(req.user.id),
                player2: '' 
            },
            finalAmount:req.body.maxAmount,
            totalAmount:req.body.maxAmount*2*0.05
        })
    }


    
    obj.save().then(response => {
        res.status(200).json({message:"Contest Created"})
    })
}


module.exports = custom