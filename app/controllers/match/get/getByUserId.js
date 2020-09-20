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
    console.log('req.query.type: ', req.query);
    if(req.query.type==="1"){
        
        cond = {
            starting_at: {
                $gt: new Date().toISOString()
            },
            gameType:parseInt(req.query.gameType)
        }
    }

    if(req.query.type==="2"){
        cond = {
            isLive:true,
            gameType:parseInt(req.query.gameType)
        }
    }

    if(req.query.type==="3"){
        cond = {
            isLive:false,
            starting_at: {
                $lt: new Date().toISOString()
            },
            gameType:parseInt(req.query.gameType)
        }
    }

    const userDetails = await Users.findById(req.user.id)
    .select('joinedMatch')
    .lean()
    .exec()
    .then(response => response)
    .catch(err => {
        
        res.status(502).json("Error try again later")
    });
    
    
    let page = await Matches.count({
        id:{$in:userDetails.joinedMatch || []},
        ...cond
        }).then(response => response)

    
    await Matches.find({
        id:{$in:userDetails.joinedMatch || []},
        ...cond
    }).skip((parseInt(req.query.page) - 1)*50).limit(50).sort({starting_at:1}).then(response => res.status(200).json({page:Math.ceil(page/50),data:response}))
    .catch(err => {
        
        res.status(502).json("Error try again later")});
 
    

}

module.exports = getUserId