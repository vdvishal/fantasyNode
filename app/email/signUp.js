const jwt = require('jsonwebtoken');


module.exports = (mail) => {
    return (
        {   
            subject:`Activation email`,
            html:`<p>Hello http://localhost:3000/activate?token=${jwt.sign({email:mail}, process.env.Email_active_key, {expiresIn:60*3})}</p>`}
        )
}