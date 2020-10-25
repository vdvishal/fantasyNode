const mongoose = require('mongoose');
 
const User = mongoose.model('Admin');
const OtherUserStats = mongoose.model('OtherUserStats');

 

/**
 * @function profile
 
 * patch
 */

const patch = async (req,res) => {  
  User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
    $set:req.body
  }).then(response => {
      res.send({message: "Profile updated succesfully"})
   }).catch(err => {
     res.send({message: "database Error"})
   })
}


 module.exports = {
    patch
 }