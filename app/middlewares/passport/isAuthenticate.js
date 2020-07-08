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

const isAuth = (req, res, next) => {
    console.log('test.........',req);
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.Access_key, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
    //  return passport.authenticate('jwt',{session:false})
}


// if(req.isAuthenticated()){
//     next()
// }else{

//     res.status(403)
//     res.send({message:res.__("user")["authenticated"]["403"]})
// }

module.exports = isAuth