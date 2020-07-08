const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const OtherUserStats = mongoose.model('OtherUserStats');

 

/**
 * @function profile
 *  get
 * 
 */

 
 const profile = async (req,res) => {
   User.findById(req.user.id).lean().then(response => {   
    res.send({message: "User profile",data:{...response}})

      //  OtherUserStats.findOne({userId:req.user.id}).lean().then(responseX => {
      //   responseX.exPoint = Math.floor(responseX.exPoint/1000);
      //   res.send({message: "User profile",data:{...response,otherStats:responseX}})
      //  }).catch(err => {
      //   res.send({message: "database Error"})
      // })
    }).catch(err => {
      res.send({message: "database Error"})
    })
}
 
 module.exports = {
    profile,
 }