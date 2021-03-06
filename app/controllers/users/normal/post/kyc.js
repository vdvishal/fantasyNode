const
    mongoose = require('mongoose'),
    User = mongoose.model('Users');

    

const kyc = async (req, res) => {
try {
    

    if(req.body.image === '' || req.body.aadharFront === ''  || req.body.aadharBack === '' ){
        return res.status(202).json({message:"Kyc image required"});
    }

    if(req.body.id === '' || req.body.aadhar === ''){
        return res.status(202).json({message:"Pan card/Aadhar Card is required"});
    }

    const  UserD = User.findById(req.user.id).select('verifiedKYC').lean().then(response => response) 

    if(UserD.verifiedKYC === true){
        return res.status(202).json({message:"KYC already verified"});
    }
    User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
        $set:{
            KYC:req.body,
            documentSubmitted:true
        }
    }).then()

    res.status(200).json({message:"Details Updated"});

} catch (error) {
    
    
    res.status(500).json({message:"Db error"});

}
}

module.exports = kyc