const mongoose = require('mongoose');
const fs = require('fs');

const _ = require('lodash');

let FantasyPlayer = require('../../models/fantasyPlayer');
FantasyPlayer = mongoose.model('FantasyPlayer');

 

 
const chalk = require('chalk');

// Get matchKey//matchData
module.exports = (data,prev,cb) => {
    mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log(chalk.bgRed("Winner update worker started"));
 
    async function count(){
         
        let Players = await FantasyPlayer.findOne({matchId:data.matchId}).lean().exec().then(response => response).catch(err => console.log(err))  
        
        let teamplayers = data.players;
        let prevplayers = prev.players;

        let arr = [];
         

        Object.entries(prevplayers).forEach(([key,value]) => {

            let cond = {
                [`${value.teamId}.${value.position.name}.${key}.selected`]:-1,
                [`${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
                [`${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
            }

            if(value.captain === true){
                cond = {
                    [`${value.teamId}.${value.position.name}.${key}.selected`]:-1,
                    [`${value.teamId}.${value.position.name}.${key}.captainCount`]: -1,
                    [`${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: 0
                }
            }

            if(value.viceCaptain === true){
                cond = {
                    [`${value.teamId}.${value.position.name}.${key}.selected`]:-1,
                    [`${value.teamId}.${value.position.name}.${key}.captainCount`]: 0,
                    [`${value.teamId}.${value.position.name}.${key}.vcaptainCount`]: -1
                }
            }
  
            arr.push(new Promise((resolve,reject) => (FantasyPlayer.updateOne({_id:mongoose.mongo.ObjectID(Players._id)},{
                $inc:cond,
             })).then(resp => resolve(true)).catch(err => reject(false))))
        });

        await Promise.all(arr).then(resp => {
            console.log(resp); 
            }).catch(err => {console.log(err);})

        let arr2 = [];


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
  
            arr2.push(new Promise((resolve,reject) => (FantasyPlayer.updateOne({_id:mongoose.mongo.ObjectID(Players._id)},{
                $inc:cond,
             })).then(resp =>{  resolve(true)}).catch(err => reject(false))))
        });
        
        await Promise.all(arr2).then(resp => {
            console.log(resp); 
            mongoose.connection.close()
            cb(null,'true')}).catch(err => {console.log(err);})
        
        
        
        // ContestType3

    }

    mongoose.connection.on('open', function (err) {
        if (err) {
            logger.error(err, 'mongoose connection open handler', 10)
        } else {
            console.log(`${chalk.green("Database connection open")}`);
            count();
        }
        //process.exit(1)
    });

    
}