
const local = require('./passport');
const jwt = require('./jwt');

// const google = require('./passport/google');
// const twitter = require('./passport/twitter');
// const linkedin = require('./passport/linkedin');
// const github = require('./passport/github');

/**
 * Expose
 */

module.exports = function(passport) {

    

  // serialize sessions

  // use these strategies
  passport.use(local);
  passport.use(jwt);

};