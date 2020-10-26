const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_SID;
const phone = process.env.TWILIO_NUMBER;

const accountSidPLIVO = process.env.PLIVO_SID;
const authTokenPLIVO = process.env.PLIVO_AUTH_SID;
const phonePLIVO = process.env.PLIVO_NUMBER;

const client = require('twilio')(accountSid, authToken);

let plivo = require('plivo');
let clientPlivo = new plivo.Client(accountSidPLIVO, authTokenPLIVO);

module.exports = sendSms = (number, message) => {
  console.log(number);
  switch (process.env.SMS) {
    case 'TWILIO':
      client.messages
        .create({
          body: message,
          from: phone,
          to: process.env.PRODUCTION == true ? number : '+916003633574'
        })
        .then(message => console.log(message));

      break;
    case 'PLIVO':

      clientPlivo.messages.create(
        phonePLIVO,
        number,
        message
      ).then(function (message_created) {
        console.log(message_created)
      });

      break;
    default:
      break;
  }




}
