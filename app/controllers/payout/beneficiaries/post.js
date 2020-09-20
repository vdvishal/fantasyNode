const axios = require('axios');
 
const mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('Users');
const randomize = require('randomatic')
const { check, validationResult } = require('express-validator'),
validator = [
    check('name').isString().notEmpty(),
    check('accNumber').isString().optional(),
    check('IFSC').isString().optional(),
    check('vpa').isString().optional(),
    check('paytmNumber').isString().optional(),
    check('address1').isString().optional(),
 ]


const beneficiaries = async (req, res) => {
    try {
        
    
    let beneId = randomize('AAAAAAAAAAAAAAAAAAAAAAAAAA');

    const userDetails = await User.findById(req.user.id).lean().then(response => response)

    let token = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/authorize",
        headers:{
            "X-Client-Id":"CF30042FEZ9R3AWFS2M2UI",
            "X-Client-Secret":"7b9d7accd44a6c575a87f1179041e9063b892afb"
        }
    }).then(response => response.data.data.token)
    console.log('token: ', token);
 
    let requestTransfer = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/addBeneficiary", //requestAsyncTransfer",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        data:{
            "beneId":beneId,// userDetails.beneId ,
            "name": req.body.name,
            email:userDetails.email,
            phone:userDetails.phone.phone,
            bankAccount:req.body.accNumber,
            ifsc:req.body.IFSC,
            vpa:req.body.vpa,
            address1: req.body.address1,
        }
    }).then(response => response.data)

    console.log('requestTransfer: ', requestTransfer);

    if(requestTransfer.status === 'ERROR'){
        return res.status(202).json({message:requestTransfer.message})
    }

    await User.updateOne({
        _id:mongoose.mongo.ObjectId(req.user.id)
    },{
        $set:{
            beneficiaryId:beneId,
            bankAccountId:req.body.IFSC.length > 0 ? req.body.IFSC.slice(0,5) + "xxxx" : '',
            vpa:req.body.vpa.length > 0 ? req.body.vpa.slice(0,3) + "xxxx" : '',
        }
    }).then(response => response.data)

    return res.status(200).json({message:"Added"})
     } catch (error) {
        console.log('error: ', error);
        return res.status(202).json({message:"Database Error"})   
    }
}


module.exports = beneficiaries