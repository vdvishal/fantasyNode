const mongoose = require('mongoose');
const match = mongoose.model('Matches');

module.exports = (req,res) => {
    match.update({
        id:parseInt(req.body.matchId)
    },{
        $set:{
            isOnsite:true
        }
    }).then(response => res.send({message:"match live"}))
} 