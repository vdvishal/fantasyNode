const axios = require('axios');
 
const mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('Users');
const randomize = require('randomatic')
const { check, validationResult } = require('express-validator'),
validator = [
    check('amount').isFloat().notEmpty(),
    check('transferMode').isInt(),
    check('name').isString().notEmpty(),
    check('accNumber').isString().optional(),
    check('IFSC').isString().optional(),
    check('vpa').isString().optional(),
    check('paytmNumber').isString().optional(),
    check('address1').isString().optional(),
 ]


const beneficiaries = async (req, res) => {
    let beneId = randomize('AAAAAAAAAAAAAAAAAAAAAAAAAA');

    const userDetails = await User.findById("5f649502820ebc1ec0108542").then(response => response)

    let token = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/authorize",
        headers:{
            "X-Client-Id":"CF30042FEZ9R3AWFS2M2UI",
            "X-Client-Secret":"7b9d7accd44a6c575a87f1179041e9063b892afb"
        }
    }).then(response => response.data.data.token)
    console.log('token: ', token);
    console.log('token: ', {
        "beneId": beneId,// userDetails.beneId ,
        "name": req.body.name,
        email:userDetails.email,
        phone:req.body.paytmNumber,
        bankAccount:req.body.accNumber,
        ifsc:req.body.IFSC,
        vpa:req.body.vpa,
        address1: req.body.address1,
    });

    let requestTransfer = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/addBeneficiary", //requestAsyncTransfer",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        data:{
            "beneId": beneId,// userDetails.beneId ,
            "name": req.body.name,
            email:userDetails.email,
            phone:req.body.paytmNumber,
            bankAccount:req.body.accNumber,
            ifsc:req.body.IFSC,
            vpa:req.body.vpa,
            address1: req.body.address1,
        }
    }).then(response => response.data)
    console.log('requestTransfer: ', requestTransfer);

}


module.exports = beneficiaries