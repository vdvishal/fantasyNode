 

const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('JWT');
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

const mongoose = require('mongoose');

 

module.exports = new JwtStrategy({
  jwtFromRequest:  ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey:'secretadminuser123'
}, (jwt_payload, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, jwt_payload);
  } catch (error) {
    console.log(error);
  }
    }
  );