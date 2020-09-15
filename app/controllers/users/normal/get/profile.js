const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const OtherUserStats = mongoose.model('OtherUserStats');
const moment = require('moment')
 

/**
 * @function profile
 *  get
 * 
 */

 
 const profile = async (req,res) => {
    User.findByIdAndUpdate(req.user.id,{$set:{
      lastOnline: moment.now()
    }})
    .select('email phone fullName userName wallet verifiedKYC refCode messageCount facebookId activated profilePic bank refLink')
    .lean().exec().then(response => {         
      
      if(response.bank){
      response.bank.IFSC = "XXXXXXX";
      response.bank.accNumber = "XXXXXXX" + '-' + response.bank.accNumber.slice(3,7);
      response.bank.image = ''
      }
      res.send({message: "User profile",data:{...response}})

      //  OtherUserStats.findOne({userId:req.user.id}).lean().then(responseX => {
      //   responseX.exPoint = Math.floor(responseX.exPoint/1000);
      //   res.send({message: "User profile",data:{...response,otherStats:responseX}})
      //  }).catch(err => {
      //   res.send({message: "database Error"})
      // })
    }).catch(err => {
      console.log(err)
      res.send({message: "database Error"})
    })
}
 
 module.exports = {
    profile,
 }