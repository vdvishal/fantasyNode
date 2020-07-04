const bcrypt = require('bcryptjs');
const response = require('./../reponse').response

const hashPassword = (password,cb) => {
    bcrypt.hash(password,10,(err, res) => {
        if(err){
            return cb(response(err.message,500,null),null)
        }else{
            return cb(null,res)
        }
    });
}

const comparePassword = (hashed,password) => bcrypt.compareSync(password,hashed)

module.exports = {
    hashPassword,
    comparePassword
}