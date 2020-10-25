const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    var token = req.headers['authorization'];


    if (token === undefined || token == '' || token == null || token === "undefined"){
        console.log('token: ', token);
 

         return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.Access_key, function (err, decoded) {
        if (err) {
            if (err['message'] == "jwt expired" || err['message'] == "invalid signature") {
                return res.status(403).send({ message: 'Token Expired' });
            }
            else { 
                return res.status(500).send({ auth: false, message: err.message, err: err });
            }
        }
        else {
            req.user = decoded;
            next()
        }
    });
}



module.exports = authenticateToken  