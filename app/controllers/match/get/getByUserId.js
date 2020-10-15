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

    if(req.query.type==="4"){
        cond = {
            isLive:false,
            pending:false,
            paid:true,
            starting_at: {
                $lt: new Date().toISOString()
            }
        }
    }

 
    
    

    
     Matches.find({
        ...cond
    }).sort({starting_at:-1}).then(response => res.status(200).json({data:response}))
    .catch(err => {
        
        res.status(502).json("Error try again later")});
 
    

}

module.exports = getUserId