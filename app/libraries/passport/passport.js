const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const hash = require('../bcrypt/index');

const User = mongoose.model('Admin');


module.exports = new LocalStrategy((email, password, done) => {
     User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (user === null) {
          return done(null, false, { message: 'No user found' });
        }
        if (!hash.comparePassword(user.password,password)) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      });
    }
  );