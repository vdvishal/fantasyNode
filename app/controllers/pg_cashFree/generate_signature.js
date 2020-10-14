const crypto = require('crypto')
const moment = require('moment')
const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const Orders = mongoose.model('Orders');
const randomize = require('randomatic');
 

const genSign = async (req,res) => {

    try {
        console.log('req.query: ', req.query);
        if(req.query.amount === ''){
            return res.status(202).json({message:"Amount must be valid"})
         }

        if(req.query.amount.match(/[A-Za-z]/)){
           return res.status(202).json({message:"Amount must be valid"})
        }

        if(parseFloat(req.query.amount) < 10 ){
            return res.status(202).json({message:"Minimum deposit is ₹10"})
         }

    let userDetail = await User.findById(req.user.id).then(response => response)

    let postData =  {
        
            appId:process.env.CASHFREE_APP_ID,
            
            // secretKey:process.env.CASHFREE_SECRET,
            orderId: `order_${moment().valueOf()}`,
            orderAmount: parseFloat(req.query.amount),
            "orderCurrency":"INR",
            "orderNote": req.user.id,
            "customerName":userDetail.fullName.length === 0 ? "New User" : userDetail.fullName,
            "customerEmail":userDetail.email,
            "customerPhone":userDetail.phone.phone,
            "returnUrl":"https://7f48b19dad0e.ngrok.io/api/v1/redirect",
            "notifyUrl": "https://7f48b19dad0e.ngrok.io/api/v1/webhook" //"https://api.fantasyjutsu.com/api/v1/webhook",
        }
 
        let signatureData = ''

        let sortedkeys = Object.keys(postData)
        sortedkeys.sort();
  
        for (var i = 0; i < sortedkeys.length; i++) {
            k = sortedkeys[i];
            signatureData += k + postData[k];
        }


 

    let sign = crypto.createHmac('sha256',process.env.CASHFREE_SECRET).update(signatureData).digest('base64');

    await User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
        $set:{
          activepayment:{           
           "id" : postData.orderId,
          "entity" : "order",
          "amount" : parseFloat(req.query.amount)*100,
          "currency" : "INR",
          "status" : "created",
          "notes" : {
              "userId" : req.user.id
          },
          "created_at" : moment().unix(),
          "orderId" : postData.orderId
            }
        }
 
      }).then(Response=> {

      })

      let orderObj = new Orders({           
        "id" : postData.orderId,
       "entity" : "order",
       "amount" : parseFloat(req.query.amount)*100,
       "currency" : "INR",
       "status" : "created",
       "notes" : {
           "userId" : req.user.id
       },
       "created_at" : moment().unix(),
       "orderId" : postData.orderId
         })
    await orderObj.save().then(resp=> {}) 
 
    res.status(200).json({...postData,sign,postUrl:"https://test.cashfree.com/billpay/checkout/post/submit"})


    } catch (error) {
        res.status(500).json({mesage:"Db Error"})

    }
}


module.exports = genSign