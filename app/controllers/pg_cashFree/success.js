const cashfree = require('cashfree-sdk');
const moment = require('moment');
const mongoose = require('mongoose');
 
const User = mongoose.model('Users');
const Orders = mongoose.model('Orders');



  const redirectPost = (req,res) => {
    console.log('req: ', req.body);
 
    
    res.redirect('https://fantasyjutsu.com');
  }


module.exports = redirectPost;