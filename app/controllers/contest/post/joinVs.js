const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');
const Users = mongoose.model('Users');
const Orders = mongoose.model('Orders');

/**
 * 
 * @param {*} req
 *                _id,team:1/2/3/4{redteam: 1 blueteam: 2 greenteam: 3 yellowteam: 4}, amount: 100         
 *  
 * @param {*} res 
 */


const joinVs = async (req, res) => {

 
    let condition = {
        _id: req.body.contestId
    }

    
    const userDetails = await Users.findById(req.user.id)
        .select('wallet')
        .lean()
        .exec()
        .then(response => response)
        .catch(err => res.status(500).json("Error try again later"));
     
    if(userDetails.wallet.balance < req.body.amount){
        return res.status(202).json({message:"Not enough balance."})
    }
     
    let team;
    let redAmount = 0;
    let blueAmount = 0;
    let greenAmount = 0;
    let yellowAmount = 0;
    let orangeAmount = 0;
    let purpleAmount = 0;
    let brownAmount = 0;
    let blackAmount = 0;
    let pinkAmount = 0;
    let greyAmount = 0;

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
    }else if(req.body.teamId === 4){
        team = {
            teamFour: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        } 

        yellowAmount = req.body.amount 
    }else if(req.body.teamId === 7){
        team = {
            teamSeven: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        }

        brownAmount = req.body.amount 
    }else if(req.body.teamId === 5){
        team = {
            teamFive: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        } 

        orangeAmount = req.body.amount 
    }else if(req.body.teamId === 6){
        team = {
            teamSix: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        }

        purpleAmount = req.body.amount 
    }else if(req.body.teamId === 8){
        team = {
            teamEight: {
                userId: req.user.id,//req.user.id,
                amount: req.body.amount 
            }
        } 

        blackAmount = req.body.amount 
    }

    let update = {
        $push:{
            ...team
        },
        $inc:{
            'totalAmount.teamOne': redAmount,
            'totalAmount.teamTwo': blueAmount,
            'totalAmount.teamThree': greenAmount,
            'totalAmount.teamFour': yellowAmount,
            'totalAmount.teamFive': orangeAmount,
            'totalAmount.teamSix': purpleAmount,
            'totalAmount.teamSeven': brownAmount,
            'totalAmount.teamEight': blackAmount,
            'finalTotal': (redAmount+blueAmount+greenAmount+yellowAmount+orangeAmount+purpleAmount+brownAmount+blackAmount+pinkAmount+greyAmount)
        }
    }

    await Contest.updateOne(condition,update).then(response => {
        AppStats.updateOne({},{
            $inc:{
                wagered:redAmount+blueAmount+greenAmount+yellowAmount+orangeAmount+purpleAmount+brownAmount+blackAmount+pinkAmount+greyAmount,
                // profit: (redAmount+blueAmount+greenAmount+yellowAmount+orangeAmount+purpleAmount+brownAmount+blackAmount+pinkAmount+greyAmount)*0.15
            }
        },{upsert:true}).then(response => {})       
    }).catch(err => console.log(err))

    let order = new Orders({
        "amount" :  req.body.amount*100,
        "status" : "contest_debit",
        "orderId": "Matchups",
        "notes" : {
            "userId" : req.user.id
        }
    })

    order.save().then().catch()

        
    await Users.updateOne({_id:req.user.id},{
        $inc:{
            "wallet.balance":-parseFloat(req.body.amount)
        }
    }).then(respo => res.status(200).json({message:"Contest Joined"}))
}

module.exports = joinVs