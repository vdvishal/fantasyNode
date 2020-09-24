const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');
 

module.exports = async (req,res) => {
    try {
        console.log('req.body: ', req.body);
 
        
        await Contest.remove({_id:mongoose.mongo.ObjectID(req.body.contestId)})
                        .then(response => {console.log('response: ', response);;res.status(200).json("Contest deleted")})
                        
   
 

        } catch (error) {
            console.log('error: ', error);
            res.status(502).json("Db error deleted")
        }
}