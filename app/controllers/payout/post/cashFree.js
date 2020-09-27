 
const axios = require('axios')
 
const mongoose = require('mongoose'),
    moment = require('moment'),
    Orders = mongoose.model('Orders'),
    User = mongoose.model('Users');
    const mqtt = require('../../../libraries/mqtt')
    const cronJob = require('cron').CronJob;



const { check, validationResult } = require('express-validator'),
validator = [
    check('amount').isFloat().notEmpty(),
    check('transferMode').isInt(),
 ]



const payout = async (req,res) => {
    try {
    
    const userDetails = await User.findById(req.user.id).lean().then(response => response);
        
    if(userDetails.verifiedKYC === false || userDetails.verifiedKYC === null){
        return res.status(202).json({message:"KYC unverified"});
    }


    if(userDetails.wallet.balance - userDetails.wallet.withdrawal < 50){
        return res.status(202).json({message:"You must deposit a minimum of ₹50 to withdraw"});
    }
    
    if(userDetails.wallet.widthraw >= req.body.amount){
        return res.status(202).json({message:"Amount is greater than available balance"})
    }

    let token = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/authorize",
        headers:{
            "X-Client-Id":process.env.CASHFREE_PAYOUT_APP_ID,
            
            "X-Client-Secret":process.env.CASHFREE_PAYOUT_SECRET
        }
    }).then(response => response.data)
    
    if(token.status === 'ERROR'){
        return res.status(202).json({message:token.message})
    }

    let requestTransfer = await axios({
        method:"POST",
        url:"https://payout-gamma.cashfree.com/payout/v1/requestAsyncTransfer",
        headers:{
            Authorization:`Bearer ${token.data.token}`,
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

    const job = new cronJob('*/30 * * * * *', function() {
        
        axios({
            method:"GET",
            url:`https://payout-gamma.cashfree.com/payout/v1/getTransferStatus?referenceId=${requestTransfer.data.referenceId}`,
            headers:{
                Authorization:`Bearer ${token.data.token}`,
                "Content-Type":"application/json"
                }
            }).then(response => {
                console.log('response: ', response.data);
                if(response.data.subCode === '200'){
                    if (response.data.data.transfer.status === 'SUCCESS') {
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
    
                      order.save().then().catch();

                      mqtt.publish('withdraw',JSON.stringify({message:"Withdrawal executed",amount:balance >= 0 ? balance : 0}),{})
                    }else{
                        job.stop();
                        let order = new Orders({
                            "amount" : parseFloat(req.body.amount)*100,
                            "status" : "Withdrawal Failed",
                            "matchId": 0,
                            "contestType": 10,
                            "orderId":"Withdrawal failed refId: " + requestTransfer.data.referenceId,
                            "notes" : {
                                "userId" : req.user.id
                            }
                          })
        
                         order.save().then().catch();
                         mqtt.publish('withdraw',JSON.stringify({message:"Withdrawal failed",amount:0}),{})

                    }
                


                }

                if(response.data.status === 'ERROR'){
                    job.stop();
                    let order = new Orders({
                        "amount" : parseFloat(req.body.amount)*100,
                        "status" : "Withdrawal Failed",
                        "matchId": 0,
                        "contestType": 10,
                        "orderId":"Withdrawal refId: " + requestTransfer.data.referenceId,
                        "notes" : {
                            "userId" : req.user.id
                        }
                      })
    
                     order.save().then().catch()
                     mqtt.publish('withdraw',JSON.stringify({message:"Withdrawal failed",amount:0}),{})

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