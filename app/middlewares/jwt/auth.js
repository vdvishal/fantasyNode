const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    var token = req.headers['authorization'];
    console.log('token', token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.Access_key, function (err, decoded) {
        if (err) {
            if (err['message'] == "jwt expired") {
                return res.status(401).send({ message: 'Token Expired' });
            }
            else {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.', err: err });
            }
        }
        else {
            req.user = decoded;
            next()
        }
    });
}



module.exports = authenticateToken  