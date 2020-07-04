const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'berenice.ratke@ethereal.email',
        pass: 'BxsNrAjcwG4s94Y2Wf'
    }
});

// let info = transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "vishalvdutta@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
// });

module.exports = (mail,cb) => {
    let mailOptions = {
        from: "your_email_address@gmail.com",
        to: mail.to,
        subject: mail.subject,
        generateTextFromHTML: true,
        html: mail.html
      };

      transporter.sendMail(mailOptions,(err,response) => {
          cb(err,response);
          transporter.close();
      })
}