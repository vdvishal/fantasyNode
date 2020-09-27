const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');
const User = mongoose.model('Users');
const Orders = mongoose.model('Orders');

 
  




  const webHook = async (req,res) => {
    console.log(req.headers);
    try {
      

    let userDetail = await User.findOne({
      'activepayment.id':req.body.orderId
    }).lean().then(response => response)

     
   let activePay = userDetail.activepayment;
   let firstBonus = 0 

 
      let signatureData =  req.body.orderId+req.body.orderAmount+req.body.referenceId+req.body.txStatus+req.body.paymentMode+req.body.txMsg+req.body.txTime
 




    let sign = crypto.createHmac('sha256',process.env.CASHFREE_SECRET).update(signatureData).digest('base64');
    console.log('sign: ', sign);
    console.log('req.body.signature: ', req.body.signature);

    if(sign ===  req.body.signature){

        if(userDetail.activepayment.status === 'created' && userDetail.activepayment.id === req.body.orderId){
          if(userDetail.firstpay !== true){
            firstBonus = (activePay.amount/100)*1;

            if(firstBonus > 25){
                firstBonus = 25
            }
         }

        await User.updateOne({_id:mongoose.mongo.ObjectID(userDetail._id)},{
            $inc:{
                'wallet.balance': activePay.amount/100,
                'wallet.bonus': firstBonus,
                messageCount:1
            },
            $set:{
                "activepayment.status": "paid",
                firstpay:true
            }
        }).then(response => {})

        
        if(userDetail.firstpay !== true && userDetail.refferData && userDetail.refferData.userId !== ''){ 
          await User.updateOne({_id:mongoose.mongo.ObjectID(userDetail.refferData.userId)},{
                $inc:{
                   'wallet.bonus': 25,
                    messageCount:1
                }
            }).then(response => {
                if(userDetail.firstpay !== true){ 
                    let order = new Orders({
                        "amount" :  25*100,
                        "status" : "bonus",
                        "orderId": "Referral Bonus",
                        "notes" : {
                            "userId" :userDetail.refferData.userId.toString()
                        }
                    })
            
                    order.save().then().catch();
    
    
                }
            })
        }

        await Orders.updateOne({orderId:req.body.orderId},{
            $set:{
                "status": "paid"
            }
        }).then(response => {

            if(userDetail.firstpay !== true){ 
                let order = new Orders({
                    "amount" :  parseInt(firstBonus)*100,
                    "status" : "bonus",
                    "orderId": "Deposit Bonus",
                    "notes" : {
                        "userId" : userDetail._id.toString()
                    }
                })
        
                order.save().then().catch();


            }

             // res.status(200).json({message:"Deposit Success"})
            })
        } 
    }
    

    return res.send("done")

    } catch (error) {
      console.log('error: ', error);
      return res.send("done")
    }
  }


module.exports = webHook;