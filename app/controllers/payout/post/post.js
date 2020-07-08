const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Payout = mongoose.model('Payout');

const payout = async (req, res) => {
    const user = await Users.findById(req.user.Id).then(response => response)

    if(user.wallet.widhraw >= req.body.amount){
        let Payo = new Payout({
            userId: req.user.Id,
            amount: req.body.amount,
        })

        Payo.save().then(resp => {

            // mqtt admin payout request notification

            res.status(200).json({message:"Payout request created"})
        })



    }else{
        res.status(202).json({message:"Amount is greater than wallet balance"})
    }
}


module.exports = get