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


const joinCustom = async (req, res) => {
    let update = {}

    const contest = await getContest(req.body._id)
    if(contest.amount !== req.body.amount){
        reject({message:'Amount mismatch'})
    }

    if(contest.redTeam.length > 0 && req.body.team === 1){
        reject({message:'Cannot join this team'})
    }else if(contest.blueTeam.length > 0 && req.body.team === 2){
        reject({message:'Cannot join this team'})
    }else{
        if(req.body.team === 1){
            update = {
                $push: {
                    redTeam: {
                        userId: 'userId',
                        amount: req.body.amount
                    }
                },
                $inc:{
                   'totalAmount.redTeam': req.body.amount
                },
                $set:{
                    open:false
                }
            }
        }else{
            update = {
                $push: {
                    blueTeam: {
                        userId: 'userId',
                        amount: req.body.amount
                    }
                },
                $inc:{
                    'totalAmount.blueTeam': req.body.amount
                 },
                 $set:{
                    open:false
                }
            }
        }
    }

    Contest.updateOne({_id:req.body._id},update).then(
        response => {
            AppStats.updateOne({},{
                $inc:{
                    wagered:req.body.amount
                }
            }).then(response => {
                res.status(200).json({message:'Contest Joined'})
                })
            }).catch()


}




const getContest = (data) => new Promise((reject,resolve) => {
    Contest.findById(data).exec().lean().then(response => resolve(response)).catch(err => reject(err))
})


module.exports = joinCustom