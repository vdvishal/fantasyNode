const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');
const User = mongoose.model('Users');
const crypto = require('crypto');

const secret= 'W!wxCAY@w5tZjy4'

const successOrder = async (req,res) => {
    
try {
   let activePay = await User.findById(req.user.id).lean().exec().then(response => response)

   activePay = activePay.activepayment;


   let Order = await Orders.findOne({orderId:activePay.orderId}).lean().exec().then(response => response)
   
    let hmac = crypto.createHmac('sha256',process.env.RAZOR_SECRET)    

    let signature  = hmac.update(activePay.orderId + "|" + req.body.razorpay_payment_id)
  
    let generated_signature = signature.digest('hex');

    if(generated_signature === req.body.razorpay_signature){
        await User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
            $inc:{
                'wallet.balance': activePay.amount/100
            },
            $set:{
                "activepayment.status": "paid"
            }
        }).then(response => response)

        await Orders.updateOne({_id:mongoose.mongo.ObjectID(Order._id)},{
            $set:{
                "status": "paid"
            }
        }).then(response => {
            res.status(200).json({message:"Deposit successfull"})
        })
    }else{
        res.status(200).json({message:"Deposit failed"})
    }

        } catch (error) {
            console.log(error); 
        }
}

//   let data = await getWebhook(req.body)
//   .then(response => response).catch()

// if(data === null){
// res.status(202).json({message:"Please wait"})
// }
//   const getWebhook = (body) => new Promise((resolve,reject) => {
//     WebHook.findOne({order_id:body.razorpay_order_id})
//                     .lean()
//                     .exec()
//                     .then(response => resolve(response))
//                     .catch(err => reject({message: "db error"}))})


module.exports = successOrder;