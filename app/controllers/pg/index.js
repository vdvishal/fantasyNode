const Razorpay = require('razorpay');
const moment = require('moment');
const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const Orders = mongoose.model('Orders');

 
var instance = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET
  })



  const createOrder = (req,res) => {

    if(req.body.amount <= 0){
      res.status(400).json({message:"Amount must be greater than 0"})
    }
      
    var options = {
        amount: parseInt(req.body.amount)*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_${moment().unix()}`,
        payment_capture:1,
        notes: {
          userId: req.user.id
        }
      };

    instance.orders.create(options, function(err, order) {
        if(err){
          res.status(400).json({message:err.message})
        }

        User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
          $set:{
            activepayment:{...order,orderId:order.id}
          }
        }).then(Response=> {
          let orderObj = new Orders({...order,orderId:order.id})
          orderObj.save().then(resp=> {
            res.status(200).json(order)
          }).catch(err => res.status(500).json({message:"db error"}))
        }).catch(err => res.status(500).json({message:"db error"}))

        
      });
  }


module.exports = createOrder;