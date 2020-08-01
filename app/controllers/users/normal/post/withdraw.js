const
    mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    Withdraw = mongoose.model('Withdraw');

    

const withdraw = async (req, res) => {
 
    const  UserD = await User.findById(req.user.id).lean().then(response => response).catch(err => err)

    if(UserD.verifiedKYC === false || UserD.verifiedKYC === null){
        return res.status(202).json({message:"KYC unverified"});
    }

    if(req.body.type === 1 && (UserD.bank === null || UserD.bank === undefined)){
        return res.status(202).json({message:"Please link a bank account"});
    }else if(req.body.type === 2 && (UserD.UPI === null || UserD.UPI === undefined)){
        return res.status(202).json({message:"Please link a upi address"});
    }

    let wdrw = new Withdraw({
        userId: mongoose.mongo.ObjectID(req.user.id),
        type:req.body.type,
        amount: req.body.amount
    }) 

    wdrw.save().then(response => res.status(200).json({message:"Request accepted and processing"})).catch()

}

module.exports = withdraw