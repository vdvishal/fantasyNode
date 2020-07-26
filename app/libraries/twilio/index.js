const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_SID;
const phone = process.env.TWILIO_NUMBER;

const client = require('twilio')(accountSid, authToken);

module.exports = sendSms = (number,message) => client.messages
  .create({
     body: message,
     from: phone,
     to: '+916003633574'
   })
  .then(message => console.log(message));

