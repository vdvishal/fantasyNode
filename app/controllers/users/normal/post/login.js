const redis = require('../../../../libraries/redis/redis');
const mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  sendSms = require('../../../../libraries/twilio'),
  hash = require('../../../../libraries/bcrypt/index'),
  randomize = require('randomatic'),
  User = mongoose.model('Users'),
  moment = require('moment'),
  { check, validationResult } = require('express-validator');

const validator = [
 ]


/**
 * @function login
 * types: steam, email
 */
let userId;
const login = async (req, res) => {

  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
  };

  const errors = validationResult(req).formatWith(errorFormatter)

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() })
  }

  switch (req.body.loginType) {
    case 2:
      User.findOne({ $or: [{ facebookId: req.body.facebookId,activated:true  }, { email: req.body.email,activated:true  }] }, function (err, user) {
        if (err) { return done(err); }
        if (user === null) {
          const userModel = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            refCode: randomize('AAAA0'),
            profilePic: req.body.profilePic,
            userName: randomize('aaaaaaaaaa'),
            wallet: {
              balance: 0,
              bonus: 0.5
            },
            totalRefers: 0,
            facebookId: req.body.facebookId,
            status: 1
          })

          userModel.save((err, resp) => {
            if (err)
              reject(err)
            else {
              userId = resp._id;
              const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN.toString() + 's', subject: 'user' });

              const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn: '86400s', subject: 'user' });

              res.send({ message: "Login success", token, refToken: refToken })
            }
          })
        } else {
          const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN.toString(), subject: 'user' });
          const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn:  process.env.REFTOKEN.toString(), subject: 'user' });
          
          User.updateOne({ _id: user._id },{$set:{refToken:refToken,profilePic: req.body.profilePic,}}).then().catch();
          res.send({ message: "Login success", token, refToken: refToken })
        }
      });
      break;
    case 3:
      User.findOne({ $or: [{ googleId: req.body.googleId,activated:true }, { email: req.body.email,activated:true }] }, function (err, user) {
        if (err) { return done(err); }
        if (user === null) {
          const userModel = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            phone: {
              countryCode: "+91",
              phone: req.body.phone ? req.body.phone : "",
              isCurrentlyActive: true,
            },
            refCode: randomize('AAAA0'),
            userName: req.body.email.split("@")[0],
            profilePic: req.body.profilePic,
            wallet: {
              balance: 0,
              bonus: 0
            },
            totalRefers: 0,
            googleId: req.body.googleId,
            status: 1
          })

          userModel.save((err, user) => {
            if (err)
              res.status(502).json({ message: "Err try again later"})
            else {
              userId = user._id;
              res.send({ message: "Verify OTP", userId,new:true })
            }
          })
        } else {
          const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN, subject: 'user' });
          const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn: '86400s', subject: 'user' });
          
          User.updateOne({ _id: user._id },{$set:{refToken:refToken,profilePic: req.body.profilePic,}}).then().catch();

          res.send({ message: "Login success", token, refToken: refToken,new:false })
        }
      });
      break;
    case 4:
      
        const token = jwt.sign({ id: "Guest" }, process.env.Guest_Access_key, { subject: 'user' });

        res.status(200)
        res.send({ message: "Guest Login success", token })
 
      break;
    default:
      User.findOne({$or: [
        { "phone.phone": req.body.email.toLowerCase(),activated:true }, { email: req.body.email.toLowerCase(),activated:true }]
      }).lean().exec().then(user => {
         if (user === null) {
          res.status(204)
          return res.status(204).json({ message: 'No user found' });
        }
        if (req.body.password === null || req.body.password.length === 0 ||  req.body.password === '') {
          res.status(202)
          return res.status(202).json({ message: 'Password is empty' });
        }
        console.log(user);
        
        if (!hash.comparePassword(user.password, req.body.password)) {
          res.status(202)
          return res.send({ message: 'Incorrect email or password.' });
        }


        const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: `${process.env.ACCESSTOKEN}`, subject: 'user' });


        const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn: `${process.env.REFTOKEN}`, subject: 'user' });
        
        User.updateOne({_id:user._id},{$set:{refToken:refToken}}).then().catch()
       
        res.status(200)
        res.send({ message: "Login success", token, refToken: refToken })
      });
      break;
  }



}


const sendVerifyCode = (phone,email) => {
  const code = randomize('AAAA0');
  const time = moment().unix();
  
  User.updateOne({_id: userId},{$set:{
      OTP:{
          time,
          code:code,
          active: true
      }
  }}).then(response => {
      sendSms(code,`Your verification code: ${code}`);
      SmsLog.updateOne({_id:new mongoose.mongo.ObjectId},{
          to: phone.phone,
          countryCode: phone.countryCode || "+91",
          code: code
      },{upsert:true}).then(response => {}).catch()
  }).catch()
}



module.exports = {
  login,
  validator
}