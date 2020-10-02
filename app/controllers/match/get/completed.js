const mongoose = require('mongoose');
const match = mongoose.model('Matches');
const Contest = mongoose.model('Contest');

const moment = require('moment')
 

const get = (req, res) => {

    match.find({starting_at:{$gt: moment().toDate().toISOString()}}).sort({starting_at:-1}).exec().then(result => 
            res.status(200).json({match:result}))
        .catch(err => res.status(502).json(err))
    
}


module.exports = get