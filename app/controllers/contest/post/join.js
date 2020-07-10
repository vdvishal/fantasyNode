const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');
const Users = mongoose.model('Users');


/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100         
 *  
 * @param {*} res 
 */


const join = (req, res) => {
    let condition = {
        _id: req.body.contestId
    }
    let team;
    let redAmount = 0;
    let blueAmount = 0;
    let greenAmount = 0;

    
    if(req.body.teamId === 1){
        team = {
            teamOne: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        }

        redAmount = req.body.amount 
    }else if(req.body.teamId === 2){
        team = {
            teamTwo: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        } 

        blueAmount = req.body.amount 
    }else if(req.body.teamId === 3){
        team = {
            teamThree: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        } 

        greenAmount = req.body.amount 
    }

    let update = {
        $push:{
            ...team
        },
        $inc:{
            'totalAmount.teamOne': redAmount,
            'totalAmount.teamTwo': blueAmount,
            'totalAmount.teamThree': greenAmount,
        }
    }

    Contest.updateOne(condition,update).then(response => {
        AppStats.updateOne({},{
            $inc:{
                wagered:redAmount+blueAmount+greenAmount
            }
        }).then(response => {})
        res.status(200).json({message:"contest joined"})
    }).catch(err => console.log(err))
}


module.exports = join