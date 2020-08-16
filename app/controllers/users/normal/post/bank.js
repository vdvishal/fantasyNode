const
    mongoose = require('mongoose'),
    User = mongoose.model('Users');


    const bank = (req, res) => {
        let object = {
            bankName: req.body.bankName,
            accNumber: req.body.accNumber,
            IFSC: req.body.IFSC,
            image:req.body.image
        }

        User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
            $set:{
                bank: object
            }
        }).then(response => res.status(200).json({message:"Bank updated, waiting to be verified"}))
        .catch(err => {
            console.log(err);
            
            res.status(500).json({message:"Error try again later"})})
    }


module.exports = bank