const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
const AppStats = mongoose.model('AppStats');
const _ = require('lodash');

/**
 * 
 * @param {*} req
 *                _id,team:- 1 - more / 0 - less, amount:- 100              
 *  
 * @param {*} res 
 */


const get = (req, res) => {
 
    Contest.find({matchId:parseInt(req.params.matchId),contestType:1})
        .lean()
        .then(arr2 =>res.status(200).json({data:[{_id:1,contest:arr2}]}))
        .catch(err => err)
}

module.exports = get