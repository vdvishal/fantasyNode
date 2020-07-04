const passport = require('passport');

/**
 * for local strategy
 */
// const isAuth = (req,res,next) => {
//     console.log(req.headers);
    
//     if(req.isAuthenticated()){
//         next()
//     }else{
       
//         res.status(403)
//         res.send({message:res.__("user")["authenticated"]["403"]})
//     }
// }

const isAuth = (req,res,next) => {
     return passport.authenticate('jwt',{session:false})
}

    // if(req.isAuthenticated()){
    //     next()
    // }else{
       
    //     res.status(403)
    //     res.send({message:res.__("user")["authenticated"]["403"]})
    // }

module.exports = isAuth