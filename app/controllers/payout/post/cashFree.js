 
const axios = require('axios')
 
const mongoose = require('mongoose'),
    moment = require('moment'),
    Orders = mongoose.model('Orders'),
    User = mongoose.model('Users');

    const cronJob = require('cron').CronJob;



const { check, validationResult } = require('express-validator'),
validator = [
    check('amount').isFloat().notEmpty(),
    check('transferMode').isInt(),
 ]



const payout = async (req,res) => {
    try {
    
    const userDetails = await User.findById(req.user.id).lean().then(response => response);
 
    
    if(userDetails.wallet.widthraw >= req.body.amount){
        return res.status(202).json({message:"Amount is greater than available balance"})
    }

    let token = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/authorize",
        headers:{
            "X-Client-Id":"CF30042FEZ9R3AWFS2M2UI",
            "X-Client-Secret":"7b9d7accd44a6c575a87f1179041e9063b892afb"
        }
    }).then(response => response.data.data.token)
 
    let requestTransfer = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/requestAsyncTransfer",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        data:{
            "beneId": userDetails.beneficiaryId,// userDetails.beneId ,
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
   
    if(requestTransfer.status === 'ERROR'){
        return res.status(202).json({message:requestTransfer.message})
    }

    setTimeout(() => {
        
    }, 60000);

    let balance = userDetails.wallet.balance - req.body.amount
    let withdrawal = userDetails.wallet.withdrawal - req.body.amount

 
    console.log('requestTransfer: ', requestTransfer);

    const job = new cronJob('*/15 * * * * *', function() {
        
        axios({
            method:"GET",
            url:`https://payout-gamma.cashfree.com/payout/v1/getTransferStatus?referenceId=${requestTransfer.data.referenceId}`,
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
                }
            }).then(response => {
                console.log('response: ', response.data);
                if(response.data.subCode === '200'){
                    job.stop();
                    User.updateOne({_id:mongoose.mongo.ObjectId(req.user.id)},{
                        $inc:{
                       'wallet.balance': balance >= 0 ? -1*req.body.amount : userDetails.wallet.balance,
                       'wallet.withdrawal': withdrawal >= 0 ? -1*req.body.amount : userDetails.wallet.withdrawal,
                       messageCount:1
                           }
                     }).lean().then(response => {
                        job.stop();
                  });

                  let order = new Orders({
                    "amount" : parseFloat(req.body.amount)*100,
                    "status" : "Withdraw",
                    "matchId": 0,
                    "contestType": 10,
                    "orderId": requestTransfer.data.referenceId,
                    "notes" : {
                        "userId" : req.user.id
                    }
                  })

                  order.save().then().catch()

                }

                if(response.data.status === 'ERROR'){
                    let order = new Orders({
                        "amount" : parseFloat(req.body.amount)*100,
                        "status" : "Withdrawal Failed",
                        "matchId": 0,
                        "contestType": 10,
                        "orderId":requestTransfer.data.referenceId,
                        "notes" : {
                            "userId" : req.user.id
                        }
                      })
    
                     order.save().then().catch()
                }
            })


    })
    
    job.start();

    res.send(requestTransfer)
} catch (error) {
    console.log('error: ', error);
    return res.status(202).json({message:"Database Error"})
 
}

}

module.exports = payout