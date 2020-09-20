 
const axios = require('axios')
 
const mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('Users');

const { check, validationResult } = require('express-validator'),
validator = [
    check('amount').isFloat().notEmpty(),
    check('transferMode').isInt(),
 ]



const payout = async (req,res) => {
    try {
    
    // const userDetails = await User.findById(req.user.id).then(response => response)
    
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
        url:"https://payout-gamma.cashfree.com/payout/v1/requestTransfer", //requestAsyncTransfer",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        data:{
            "beneId": 'LHZVHFMVYJGWTZHJDBIHKDCLDY',// userDetails.beneId ,
            "amount": req.body.amount || 1,
            "transferId": moment().valueOf(),
            transferMode:req.body.transferMode === 1 ? "banktransfer" : 
            req.body.transferMode === 2 ? "upi" : 
            req.body.transferMode === 3 ? "paytm" :
            req.body.transferMode === 4 ? "amazonpay" :
            "banktransfer"
        }
    }).then(response => response.data)

    // let Transfers = await Payouts.Transfers.RequestTransfer({
    //     "beneId": "test",
    //     "transferId": "tranfer001234",
    //     "amount": "1.00",
    // }).then(response => response)

    console.log('requestTransfer: ', requestTransfer);

    res.send(requestTransfer)
} catch (error) {
    console.log('error: ', error);
        
}

}

module.exports = payout