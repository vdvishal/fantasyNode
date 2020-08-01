const
    mongoose = require('mongoose'),
    User = mongoose.model('Users');

    

const kyc = async (req, res) => {
     console.log(req.body);
     console.log(req.user.id);
    const  UserD = User.findById(req.user.id).select('verifiedKYC').lean().then(response => response).catch(err => err)

    if(UserD.verifiedKYC === true){
        return res.status(202).json({message:"KYC already verified"});
    }
    User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
        $set:{
            KYC:req.body,
            documentSubmitted:true
        }
    }).then().catch(0)

    res.status(200).json({message:"Details Updated"});
}

module.exports = kyc