var workerFarm = require('worker-farm')
  , workers    = workerFarm(require.resolve('../nodeMailer/index.js')),
    logger = require('winston'),
    mongoose = require('mongoose')
    Email = mongoose.model('EmailLogs')

const sendMail = (data) => {
    workers(data,(err,response) => {
        if(err){
            logger.error(err.message)
        }else{
            logger.info("Mail sent")
        }

        Email.insertMany([{
            to:data.to,
            subject: data.subject,
        }]).then().catch()
        workerFarm.end(workers);
    })
}

module.exports = sendMail;