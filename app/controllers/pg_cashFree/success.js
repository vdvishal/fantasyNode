const cashfree = require('cashfree-sdk');
const moment = require('moment');
const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const Orders = mongoose.model('Orders');



  const redirectPost = (req,res) => {
    console.log('req: ', req.body);

    const { orderId,
    orderAmount,
    referenceId,
    txStatus,
    paymentMode,
    txMsg,
    txTime,
    signature } = req.body
 
      res.redirect(`http://localhost:3000/success?orderId=${orderId}&orderAmount=${orderAmount}&referenceId=${referenceId}&txStatus=${txStatus}&paymentMode=${paymentMode}&txMsg=${txMsg}&txTime=${txTime}`);
 
    
  }


module.exports = redirectPost;