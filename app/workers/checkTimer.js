
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

const axios = require('axios')
const chalk = require('chalk');
const moment = require('moment');


const instance = axios.create({
    baseURL: process.env.API_URL,
});

require('../models/user');
require('../models/orders');

require('../models/matches');
require('../models/contest');

require('../models/fantasyPlayer');
require('../models/fantasyJoinedContest');
require('../models/fantasyJoinedContest');

require('../models/FantasyLeaderBoard');
require('../models/fantasyContest');
require('../models/fantasyUsersTeam');
 
require('../models/MatchUpContest');
require('../models/UnderOverContest');

const match = mongoose.model('Matches');

let Contest = mongoose.model('Contest');
let FantasyPlayer = mongoose.model('FantasyPlayer');
let FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
let FantasyLeaderBoard = mongoose.model('FantasyLeaderBoard');
let FantasyContest = mongoose.model('FantasyContest');
let MatchUpContest = mongoose.model('MatchUpContest');
let UnderOverContest = mongoose.model('UnderOverContest');
let FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');


let User = mongoose.model('Users');
let Orders = mongoose.model('Orders');


const getMatch = async () => {

    console.log(`${chalk.greenBright("CheckTimer Worker Started")}`)

    try {
        let up = []
        let axiosR = []
        let matches = await match.find({
            
            $or:[
                {
                    isLive:{
                        $ne:true
                    },
                    "status":'NS'
                },
                {
                    isLive:{
                        $ne:true
                    },
                    "status":'Postp.'
                },
                {
                    isLive:{
                        $ne:true
                    },
                    "status":'Postp.'
                },
                {
                    isLive:{
                        $ne:true
                    },
                    "status":'Delayed'
                }
            ]

        })
        .sort({starting_at:1})
        .lean()
        .exec()
        .then(result => result)
        
        
         
        matches.forEach(element => {            
            if(moment(element.starting_at).unix() <= moment().unix()){
                

                console.log("moment(element.starting_at).unix() -  moment().unix() <= moment().unix()");

                        axiosR.push(new Promise((resolve,reject) => {
                            instance.get(`/fixtures/${element.id}?api_token=${process.env.Access_key}&include=batting,batting.catchstump,batting.batsman,batting.bowler,bowling.team,bowling.bowler,scoreboards,scoreboards.team,lineup,batting.batsmanout`) //,balls.catchstump
                            .then(response => {
                                // console.log(response.data);
                                
                                if( 
                                response.data.data.status ==  "Aban." || 
                                response.data.data.status ==  "Cancl." ||
                                response.data.data.status ==  "Postp." ||
                                response.data.data.status ==  "Finished"
                                ){
                                    up.push(new Promise((resolve,reject) => {
                                        match.updateOne({
                                            _id:mongoose.mongo.ObjectID(element._id)
                                        },{
                                            $set:{
                                                status:response.data.data.status
                                            }
                                        }).then(resp => resolve(true)).catch(err => reject(false))
                                    }))
                                }else{
                                    up.push(new Promise((resolve,reject) => {
                                        match.updateOne({
                                            _id:mongoose.mongo.ObjectID(element._id)
                                        },{
                                            $set:{
                                                isLive:true,
                                                status:response.data.data.status
                                            }
                                        }).then(resp => resolve(true)).catch(err => reject(false))
                                    }))
                                }

                                resolve(true)
                            }).catch(err => reject(false))
                        }))
            }
        });
        
        await Promise.all(axiosR).then(resp => resp).catch(err => err)

        await Promise.all(up).then(resp => resp).catch(err => err)

        console.log(`${chalk.greenBright("CheckTimer Worker Ended")}`)

    } catch (error) {
        console.log(error);
    }

}

const cronJob = require('cron').CronJob;

const job = new cronJob('*/120 * * * * *', function() {
    console.log(chalk.bgRed("Live Count job"));

    getMatch().then().catch();


})
getMatch().then().catch();

job.start();