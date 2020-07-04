const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');

/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100              
 *  
 * @param {*} res 
 */


const custom = (req, res) => {
    let team;
    let redAmount = 0;
    let blueAmount = 0;
    let red;
    let blue;
    if(team === 1){
        red = {
            userId: 'userId',//req.user.id,
            amount: req.body.amount 
        }

        redAmount = req.body.amount 
    }else{
        blue = {
            userId: 'userId',//req.user.id,
            amount: req.body.amount 
        } 

        blueAmount = req.body.amount 
    }

    let obj = new Contest({
        contestName: 'More or less',
        contestType: req.body.contestType,
        value: req.body.value,
        type: req.body.type,
        typeName: req.body.type === '1' ? 'Runs' : req.body.type === '2' ? "Wickets" : "Fantasy Points",
        info: {
            redTeam: `More than ${req.body.value}`,
            blueTeam:`Less than ${req.body.value}`,
        },
        matchId: req.body.matchId,
        playerId: req.body.playerId,
        playerDetails: req.body.playerDetails,
        amount: redAmount+blueAmount,
        totalAmount: {
            redTeam: redAmount,
            blueTeam: blueAmount
        },
        redTeam:[
            red
        ],
        blueTeam: [
            blue
        ]
    })
    
    obj.save().then(response => {
        AppStats.updateOne({},{
            $inc:{
                wagered:redAmount+blueAmount
            }
        }).then(response => {
            res.status(200).json({message:"Contest Created"})
        })
    })
}


module.exports = custom