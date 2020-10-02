var workerFarm = require('worker-farm'),
     logger = require('winston'),
    mongoose = require('mongoose'),
    Transaction = mongoose.model('transaction');

    const update = (data) => {
        workerFarm(Transaction.updateOne({userId:data.userId},{...data}).then(res =>{
            logger.info("transaction updated")
            return true
        }))
    }
    
    module.exports = update;