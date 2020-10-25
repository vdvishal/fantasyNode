const mongoose = require('mongoose');
 
const User = mongoose.model('Admin');
const Orders = mongoose.model('Orders');
const moment = require('moment')
 

/**
 * @function profile
 *  get
 * 
 */

 
 const profile = async (req,res) => {

  let statsTotal = await Orders.aggregate([
    [
        {
          '$group': {
            '_id': null, 
            'deposit': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$status', 'paid'
                    ]
                  }, 
                  'then': {$divide: [ "$amount", 100 ]}, 
                  'else': 0
                }
              }
            },
            'withdraw': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$status', 'Withdraw'
                    ]
                  }, 
                  'then': {$divide: [ "$amount", 100 ]}, 
                  'else': 0
                }
              }
            },
            'amountCollected': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$status', 'contest_debit'
                    ]
                  }, 
                  'then': {$divide: [ "$amount", 100 ]}, 
                  'else': 0
                }
              }
            }, 
            'amountPaid': {
              '$sum': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$status', 'contest_credit'
                    ]
                  }, 
                  'then': {$divide: [ "$amount", 100 ]}, 
                  'else': 0
                }
              }
            }
          }
        }, {
          '$project': {
            '_id': 1, 
            'amountCollected': 1, 
            'amountPaid': 1, 
            'profit': {
              '$subtract': [
                '$amountCollected', '$amountPaid'
              ]
            }
          }
        }
      ]
  ]).then(response => response)    

  let allStats = await User.aggregate([{
    $project:{
      balance:{
        $sum:"$wallet.balance"
      },
      bonus:{
        $sum:"$wallet.bonus"
      },
      withdrawal:{
        $sum:"$wallet.withdrawal"
      },
    }
  }]).then(response => response) 

    await User.findByIdAndUpdate(req.user.id,{$set:{
      lastOnline: moment.now()
    }})
    .select('email phone fullName userName wallet verifiedKYC stats bankAccountId vpa beneficiaryId refCode messageCount facebookId activated profilePic refLink')
    .lean().exec().then(response => {    
      console.log('statsTotal: ', statsTotal[0]);     
      response.wallet.balance = statsTotal[0] ? statsTotal[0].profit : 0
      response.wallet.bonus = allStats[0] ?  allStats[0].bonus : 0
      response.wallet.withdrawal =   allStats[0] ?   allStats[0].withdrawal : 0

      res.send({message: "User profile",data:{...response,statsTotal:statsTotal[0]}})

      //  OtherUserStats.findOne({userId:req.user.id}).lean().then(responseX => {
      //   responseX.exPoint = Math.floor(responseX.exPoint/1000);
      //   res.send({message: "User profile",data:{...response,otherStats:responseX}})
      //  }).catch(err => {
      //   res.send({message: "database Error"})
      // })
    }).catch(err => {
      console.log('err: ', err);
      
      res.send({message: "database Error"})
    })
}
 
 module.exports = {
    profile,
 }