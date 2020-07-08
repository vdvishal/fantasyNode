const redis = require('../../../../libraries/redis/redis');
const mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  hash = require('../../../../libraries/bcrypt/index'),
  randomize = require('randomatic'),
  User = mongoose.model('Users'),
  { check, validationResult } = require('express-validator');

const validator = [
  check('email').isEmail(),
]


/**
 * @function login
 * types: steam, email
 */

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
      User.findOne({ $or: [{ facebookId: req.body.facebookId }, { email: req.body.email }] }, function (err, user) {
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
          const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN.toString() + 's', subject: 'user' });
          const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn: '86400s', subject: 'user' });
          User.updateOne({ email: req.body.email }, { profilePic: req.body.profilePic, }).then().catch();
          res.send({ message: "Login success", token, refToken: refToken })
        }
      });
      break;
    case 3:
      User.findOne({ $or: [{ googleId: req.body.googleId }, { email: req.body.email }] }, function (err, user) {
        if (err) { return done(err); }
        if (user === null) {
          const userModel = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            refCode: randomize('AAAA0'),
            userName: randomize('aaaaaaaaaa'),
            profilePic: req.body.profilePic,
            wallet: {
              balance: 0,
              bonus: 0.5
            },
            totalRefers: 0,
            googleId: req.body.googleId,
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
          const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN.toString() + 's', subject: 'user' });
          User.updateOne({ email: req.body.email }, { profilePic: req.body.profilePic, }).then().catch();
          const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn: '86400s', subject: 'user' });

          res.send({ message: "Login success", token, refToken: refToken })
        }
      });
      break;
    default:
      User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { return done(err); }
        if (user === null) {
          res.status(204)
          return res.status(204).json({ message: 'No user found' });
        }
        if (!hash.comparePassword(user.password, req.body.password)) {
          res.status(401)
          return res.send({ message: 'Incorrect email or password.' });
        }


        const token = jwt.sign({ id: user._id }, process.env.Access_key, { expiresIn: process.env.ACCESSTOKEN.toString() + 's', subject: 'user' });


        const refToken = jwt.sign({ id: user._id }, 'ref', { expiresIn: '86400s', subject: 'user' });

        res.send({ message: "Login success", token, refToken: refToken })
      });
      break;
  }



}



module.exports = {
  login,
  validator
}