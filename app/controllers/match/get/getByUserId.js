const mongoose = require('mongoose');
 
const Matches = mongoose.model('Matches');
const Users = mongoose.model('Users');


const _ = require('lodash')
/**
 * 
 * @param {*} req
 *               status: past, upcoming, live            
 *          
 * @param {*} res 
 */


const getUserId = async (req, res) => {
    let cond = {
        starting_at: {
            $gt: new Date().toISOString()
        }
    }
    if(req.query.type === undefined || req.query.type === ''){
        res.status(400).json("Type is missing")
    }
    
    if(req.query.type==="1"){
        cond = {
            starting_at: {
                $gt: new Date().toISOString()
            }
        }
    }

    if(req.query.type==="2"){
        cond = {
            isLive:true
        }
    }

    if(req.query.type==="3"){
        cond = {
            isLive:false,
            starting_at: {
                $lt: new Date().toISOString()
            }
        }
    }

    const userDetails = await Users.findById(req.user.id)
    .select('joinedMatch')
    .lean()
    .exec()
    .then(response => response)
    .catch(err => {
        console.log(err)
        res.status(502).json("Error try again later")
    });
    
    console.log(userDetails)

    
     Matches.find({
        id:{$in:userDetails.joinedMatch || []},
        ...cond
    }).then(response => res.status(200).json({data:response}))
    .catch(err => {
        console.log(err)
        res.status(502).json("Error try again later")});
 
    

}

module.exports = getUserId