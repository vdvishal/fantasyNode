const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const OtherUserStats = mongoose.model('OtherUserStats');

 

/**
 * @function profile
 
 * patch
 */

const patch = async (req,res) => {
  User.updateOne({_id:req.user.id},{
    $set:{
      ...req.body
    }
  }).then(response => {
      res.send({message: "User profile"})
   }).catch(err => {
     res.send({message: "database Error"})
   })
}


 module.exports = {
    patch
 }