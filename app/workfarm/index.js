var workerFarm = require('worker-farm')
  , workers    = workerFarm(require.resolve('./teamupdate/index.js')),
    logger = require('winston');
    const chalk = require('chalk');

 
 
 

const teamUpdate = (data) => {   
    console.log(chalk.bgRed("TeamUpdate Worker started"));
    workers(data,(err,response) => {
        console.log(chalk.blueBright("teamUpdate Worker end"));
        workerFarm.end(workers);
   })
}


module.exports = {
    teamUpdate
};