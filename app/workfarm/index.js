var workerFarm = require('worker-farm'),
    workers    = workerFarm(require.resolve('./teamupdate/index.js')),
    updateSel    = workerFarm(require.resolve('./teamupdate/update.js')),
    logger = require('winston');
    const chalk = require('chalk');

 
 
 

const teamUpdate = (data,prev,type) => {   
    console.log(chalk.bgRed("TeamUpdate Worker started"));
    if(type == 2){
        console.log(chalk.bgGreen("TeamUpdate type 2 Worker started"));

        updateSel(data,prev,(err,response) => {
            console.log(chalk.blueBright("teamUpdate Worker end"));
           // workerFarm.end(updateSel);
       })
    }else{
        console.log(chalk.bgGreen("TeamUpdate type 1 Worker started"));

        workers(data,(err,response) => {
            console.log(chalk.blueBright("teamUpdate Worker end"));
            // workerFarm.end(workers);
       })
    }

}


module.exports = {
    teamUpdate
};