const crypto = require('crypto')
const moment = require('moment')
const mongoose = require('mongoose');
 
const User = mongoose.model('Users');


const genSign = async (req,res) => {
    let userDetail = await User.findById(req.user.id).then(response => response)

    let obj =  {
            appId:process.env.CASHFREE_APP_ID,
            // secretKey:process.env.CASHFREE_SECRET,
            orderId: `receipt_${moment().unix()}`,
            orderAmount: parseFloat(req.body.amount),
            "orderCurrency":"INR",
            "orderNote": req.user.id,
            "customerName":userDetail.fullName.length === 0 ? "New User" : userDetail.fullName,
            "customerPhone":userDetail.phone.phone,
            "customerEmail":userDetail.email,
            "returnUrl":"http://localhost:3000/myaccount",
            "notifyUrl":"https://api.fantasyjutsu.com/api/v1/webhook",
        }

        let signatureData = ''

        Object.keys(obj).forEach(([key,value]) => {
            signatureData += key+data
        })
    

    let sign = crypto.createHmac('sha256',process.env.CASHFREE_SECRET).update(signatureData).digest('base64');

    res.status(200).json({sign,userData:obj})
}


module.exports = genSign