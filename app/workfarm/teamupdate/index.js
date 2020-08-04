const mongoose = require('mongoose');
const fs = require('fs');

const _ = require('lodash');

let FantasyPlayer = require('../../models/fantasyPlayer');
FantasyPlayer = mongoose.model('FantasyPlayer');

 

 
const chalk = require('chalk');

// Get matchKey//matchData
module.exports = (data,cb) => {
    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log(chalk.bgRed("Winner update worker started"));
 
    async function count(){
         
        let Players = await FantasyPlayer.findOne({matchId:data.matchId}).lean().exec().then(response => response).catch(err => console.log(err))  
        
        let teamplayers = data.players;

        let arr = [];

        Object.entries(teamplayers).forEach(([key,value]) => {
            let cond = {
                [`${value.teamId}.${value.position.name}.${key}.selected`]:1,
                [`${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
                [`${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
            }

            if(value.captain === true){
                cond = {
                    [`${value.teamId}.${value.position.name}.${key}.selected`]:1,
                    [`${value.teamId}.${value.position.name}.${key}.captainCount`]: 1,
                    [`${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
                }
            }

            if(value.viceCaptain === true){
                cond = {
                    [`${value.teamId}.${value.position.name}.${key}.selected`]:1,
                    [`${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
                    [`${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 1
                }
            }
  
            arr.push(new Promise((resolve,reject) => (FantasyPlayer.updateOne({_id:mongoose.mongo.ObjectID(Players._id)},{
                $inc:cond,
                $set:{totalTeams: Players.totalTeams ? Players.totalTeams + 1 : 1}
            })).then(resp => resolve(true)).catch(err => reject(false))))
        });
        
        await Promise.all(arr).then(resp => (true)).catch(err => {console.log(err);})
        
        
        mongoose.connection.close()
        cb(null,'true')
        // ContestType3

    }

    mongoose.connection.on('open', function (err) {
        if (err) {
            logger.error(err, 'mongoose connection open handler', 10)
        } else {
            console.log(`${chalk.blueBright("Database connection open")}`);
            count();
        }
        //process.exit(1)
    });

    
}