const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    var token = req.headers['authorization'];
      console.log('token_cookie',req.headers)

    if (token === undefined || token == '' || token == null || token === "undefined"){
        console.log('token_cookie', token)

         return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.Access_key, function (err, decoded) {
        if (err) {
            console.log('err: ', err);
            if (err['message'] == "jwt expired") {
                return res.status(403).send({ message: 'Token Expired' });
            }
            else {
                 
                return res.status(496).send({ auth: false, message: err.message, err: err });
            }
        }
        else {
            req.user = decoded;
            next()
        }
    });
}



module.exports = authenticateToken  