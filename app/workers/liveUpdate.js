const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

const chalk = require('chalk');
var mqtt = require('mqtt')
var MqttClientId = "MQTT_CLIENT_" + new Date().getTime();

require('../models/matches');
require('../models/fantasyPlayer');
require('../models/fantasyJoinedContest');
require('../models/FantasyLeaderBoard');
require('../models/fantasyContest');
require('../models/fantasyUsersTeam');


const match = mongoose.model('Matches');
const _ = require('lodash')

let FantasyPlayer = mongoose.model('FantasyPlayer');

let FantasyUsersTeam = mongoose.model('FantasyUsersTeam');

const lineupUpdate = require('../workFarm/lineupUpdate')

const leaderBoard = require('../workFarm/leaderBoard')

var mqtt_options = {
    clientId: MqttClientId,
    keepalive: 30,
    clean: false
};



var client  = mqtt.connect(process.env.MQTT_IP_WS,mqtt_options)

console.log(process.env.MQTT_IP_WS);

client.on('connect', function () {
    console.log("Connected: MQTT ");
 })
client.on("error", function (error) {
    console.log("ERROR: ", error);
});
client.on('offline', function () {
    console.log("offline");
});

client.on('reconnect', function () {
    console.log("reconnect");
});

 
async function liveCount() {
 
    try {
 
        console.log(`${chalk.cyanBright("liveUpdate started")}`)

        let matchArr = await match.find({isLive:true})
                                        .select("-balls")
                                        .lean()
                                        
                                        .exec()
                                        .then(response => response)
                                        .catch(err => (err))

        
        let lineup = [];
        let count = [];
        let leaderBoardUp = []
 
 
        if(matchArr.length > 0){
            for (let index = 0,len = matchArr.length; index < len; index++) {
                let match = matchArr[index]
                if(match.isLineupUpdated === false){
                    lineup.push(new Promise((resolve,reject) => {
                        resolve('')                    
                    }))
                }else{
                    console.log(chalk.greenBright("Lineup update"));

                    if(match.lineup && match.lineup.length > 0){
                        lineup.push(new Promise((resolve,reject) => {
                            lineupUpdate(match.lineup,match.id).then(response => resolve(response)).catch(err => reject(err))
                        }))
                    }else{
                        lineup.push(new Promise((resolve,reject) => {
                            resolve('')                    
                        }))
                    }

                }

                count.push(countPoints(match))
                // leaderBoardUp.push(new Promise((resolve,reject) => {
                //     leaderBoard(match.id).then(response => resolve(response)).catch(er => reject(er))
                // }))
            }
        
            await Promise.all(lineup).then(response => response)
        
            // await Promise.all(count).then(response => response)


            for (let index = 0,len = matchArr.length; index < len; index++) {
                let match = matchArr[index]
                leaderBoardUp.push(new Promise((resolve,reject) => {
                    leaderBoard(match.id).then(response => resolve(response)).catch(er => reject(er))
                }))
            }

 
            await Promise.all(leaderBoardUp).then(response => response)

            console.log(chalk.redBright("Live COUNTING FINISHED"));

        }

        console.log(chalk.cyanBright("Live match: "+ matchArr.length));

    } catch (error) {
 
        console.log(error);
        
    }


}


const countPoints = (matchData) => new Promise((resolve, reject) => {

    console.log(chalk.redBright("Live countPoints: "+ matchData.id));
    

    if(matchData.lineup && matchData.lineup.length > 0){
        FantasyPlayer.findOne({ matchId: parseInt(matchData.id) })
        .lean()
        .exec()
        .then(players => {

 
            

            let playerObj = matchData
            let lineUp = playerObj.lineup;
            let batting = playerObj.batting;
            let bowling = playerObj.bowling;

            let localteam_id = playerObj.localteam_id
            let visitorteam_id = playerObj.visitorteam_id

            // console.log(matchData)

            if(matchData.type === "T20I" || matchData.type === "T20" ){


                    lineUp.forEach(player => {
                        let pos = player.position.name;
                        if(players.players[(parseInt(player['lineup']['team_id'])).toString()][pos][player.id] === undefined){
                            players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id] = player
                        }
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id]['points'] = 2
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id]['catchStump'] = 0
                    })

                    batting.forEach(player => {
                        // players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['points'] =

                        players.players[player['team_id']][player.batsman.position.name][player.batsman.id]['battingScoreCard'] = player;

                        let points = player.score * 1 + player.four_x * 1 + player.six_x * 2
                        points += player.score >= 50 ? 8 : 0
                        points += player.score >= 100 ? 8 : 0


                        if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                            if (player.score === 0) {
                                points -= 2
                            }
                        }


                        if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                            if (player.ball >= 10) {
                                if (player.rate > 70) {

                                } else if (player.rate <= 70 && player.rate > 60) {
                                    points -= 2
                                } else if (player.rate <= 60 && player.rate > 50) {
                                    points -= 4
                                } else if (player.rate <= 50) {
                                    points -= 6
                                }
                            }
                        }

                        players.players[player['team_id']][player.batsman.position.name][player.batsman.id]['points'] += points;

                        if (player['team_id'] === localteam_id && player.bowler !== null) {
                            players.players[visitorteam_id][player.bowler.position.name][player.bowler.id]['points'] += 25;
        
                        }
        
                        if (player.catchstump !== null && player['team_id'] === localteam_id) {
                            players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['points'] += 12;
        
                            players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] =  players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] ?
                                                                                    players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] +  1 : 1
                        }
        
                        if (player['team_id'] === visitorteam_id && player.bowler !== null) {
                            //  console.log(players.players[visitorteam_id][player.catchstump.position.name] );
        
                            players.players[localteam_id][player.bowler.position.name][player.bowler.id]['points'] += 25;
                        }
        
        
                        if (player.catchstump !== null && player['team_id'] === visitorteam_id) {
                            players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['points'] += 12;
                            players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] = players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] ?
                                                                                players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] +  1 : 1;
                        }


                    })


                    bowling.forEach(player => {

        
        
                        players.players[player['team_id']][player.bowler.position.name][player.bowler.id]['bowlingScoreCard'] = player;



                        let points = player.wickets === 4 ? 8 : player.wickets >= 5 ? 16 : 0;
                        points += player.medians * 8


                        let eco = 0

                        if (player.overs >= 2) {
                            if (player.rate < 4) {
                                eco = 6
                            } else if (player.rate < 5 && player.rate >= 4) {
                                eco = 4
                            } else if (player.rate < 6 && player.rate >= 5) {
                                eco = 2
                            } else if (player.rate < 10 && player.rate >= 9) {
                                eco = -2
                            } else if (player.rate < 11 && player.rate >= 10) {
                                eco = -4
                            } else if (player.rate >= 11) {
                                eco = -6
                            }
                        }

                        points += eco;

                        players.players[player['team_id']][player.bowler.position.name][player.bowler.id]['points'] += points;
                    })
            }

            if(matchData.type === "ODI"){


                lineUp.forEach(player => {
                    let pos = player.position.name;
                    if(players.players[(parseInt(player['lineup']['team_id'])).toString()][pos][player.id] === undefined){
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id] = player
                    }
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id]['points'] = 2
                })

                batting.forEach(player => {
    
                    players.players[player['team_id']][player.batsman.position.name][player.batsman.id]['battingScoreCard'] = player;

                    let points = player.score * 1 + player.four_x * 1 + player.six_x * 2
                    points += player.score >= 50 ? 4 : 0
                    points += player.score >= 100 ? 4 : 0


                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.score === 0) {
                            points -= 4
                        }
                    }


                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.ball >= 20) {
                            if (player.rate > 70) {

                            } else if (player.rate <= 60 && player.rate >= 50) {
                                points -= 2
                            } else if (player.rate <= 49.9 && player.rate >= 40) {
                                points -= 4
                            } else if (player.rate <= 39.99) {
                                points -= 6
                            }
                        }
                    }

                    players.players[player['team_id']][player.batsman.position.name][player.batsman.id]['points'] += points;


                    if (player['team_id'] === localteam_id && player.bowler !== null) {
                        players.players[visitorteam_id][player.bowler.position.name][player.bowler.id]['points'] += 25;
    
                    }
    
                    if (player.catchstump !== null && player['team_id'] === localteam_id) {
                        players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['points'] += 12;
    
                        players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] =  players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] ?
                                                                                players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] +  1 : 1
                    }
    
                    if (player['team_id'] === visitorteam_id && player.bowler !== null) {
                        //  console.log(players.players[visitorteam_id][player.catchstump.position.name] );
    
                        players.players[localteam_id][player.bowler.position.name][player.bowler.id]['points'] += 25;
                    }
    
    
                    if (player.catchstump !== null && player['team_id'] === visitorteam_id) {
                        players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['points'] += 12;
                        players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] = players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] ?
                                                                            players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] +  1 : 1;
                    }




                })


                bowling.forEach(player => {

    
    
                    players.players[player['team_id']][player.bowler.position.name][player.bowler.id]['bowlingScoreCard'] = player;



                    let points = player.wickets === 4 ? 8 : player.wickets >= 5 ? 16 : 0;
                    points += player.medians * 8


                    let eco = 0

                    if (player.overs >= 5) {
                        if (player.rate < 2.5) {
                            eco = 6
                        } else if (player.rate < 2.5 && player.rate >= 3.49) {
                            eco = 4
                        } else if (player.rate < 3.5 && player.rate >= 4.5) {
                            eco = 2
                        } else if (player.rate < 7 && player.rate >= 7.99) {
                            eco = -2
                        } else if (player.rate < 8 && player.rate >= 8.99) {
                            eco = -4
                        } else if (player.rate >= 9) {
                            eco = -6
                        }
                    }

                    points += eco;

                    players.players[player['team_id']][player.bowler.position.name][player.bowler.id]['points'] += points;
                })
            }

            if(matchData.type === "4day" || matchData.type === 'Test/5day' || matchData.type === '5day' || matchData.type === 'Test'){


                lineUp.forEach(player => {
                    let pos = player.position.name;
                    if(players.players[(parseInt(player['lineup']['team_id'])).toString()][pos][player.id] === undefined){
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id] = player
                    }
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.position.name][player.id]['points'] = 2
                })

                batting.forEach(player => {
    
                    players.players[player['team_id']][player.batsman.position.name][player.batsman.id]['battingScoreCard'] = player;

                    let points = player.score * 1 + player.four_x * 1 + player.six_x * 2
                    points += player.score >= 50 ? 4 : 0
                    points += player.score >= 100 ? 4 : 0


                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.score === 0) {
                            points -= 4
                        }
                    }


 

                    players.players[player['team_id']][player.batsman.position.name][player.batsman.id]['points'] += points;


                    if (player['team_id'] === localteam_id && player.bowler !== null) {
                        players.players[visitorteam_id][player.bowler.position.name][player.bowler.id]['points'] += 20;
    
                    }
    
                    if (player.catchstump !== null && player['team_id'] === localteam_id) {
                        players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['points'] += 12;
    
                        players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] =  players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] ?
                                                                                players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] +  1 : 1
                    }
    
                    if (player['team_id'] === visitorteam_id && player.bowler !== null) {
                        //  console.log(players.players[visitorteam_id][player.catchstump.position.name] );
    
                        players.players[localteam_id][player.bowler.position.name][player.bowler.id]['points'] += 20;
                    }
    
    
                    if (player.catchstump !== null && player['team_id'] === visitorteam_id) {
                        players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['points'] += 12;
                        players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] = players.players[localteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] ?
                                                                            players.players[visitorteam_id][player.catchstump.position.name][player.catchstump.id]['catchStump'] +  1 : 1;
                    }




                })


                bowling.forEach(player => {

    
    
                    players.players[player['team_id']][player.bowler.position.name][player.bowler.id]['bowlingScoreCard'] = player;



                    let points = player.wickets === 4 ? 4 : player.wickets >= 5 ? 8 : 0;
                    points += player.medians * 4


                    let eco = 0

   

                    points += eco;

                    players.players[player['team_id']][player.bowler.position.name][player.bowler.id]['points'] += points;
                })
            }


            FantasyPlayer.updateOne({ matchId: parseInt(matchData.id) }, players).then(response => {
 
                let allPlayers = {
                    ...players.players[players.localTeam].Allrounder, ...players.players[players.visitorTeam].Allrounder,
                    ...players.players[players.localTeam].Batsman, ...players.players[players.visitorTeam].Batsman,
                    ...players.players[players.localTeam].Wicketkeeper, ...players.players[players.visitorTeam].Wicketkeeper,
                    ...players.players[players.localTeam].Bowler, ...players.players[players.visitorTeam].Bowler
                }
                let count = [];

                let mqttPayload = {
                    matchId:matchData.id,
                    matchDetail:matchData,
                    localTeam:players.localTeam,
                    visitorTeam:players.visitorTeam,
                    players:{
                        [players.localTeam]:{...players.players[players.localTeam].Allrounder,
                            ...players.players[players.localTeam].Batsman,
                            ...players.players[players.localTeam].Wicketkeeper,
                            ...players.players[players.localTeam].Bowler},
                        [players.visitorTeam]:{...players.players[players.visitorTeam].Allrounder,
                            ...players.players[players.visitorTeam].Batsman,
                            ...players.players[players.visitorTeam].Wicketkeeper,
                            ...players.players[players.visitorTeam].Bowler},
                    }
        
                }
                
                mqttPayload.players[players.localTeam] = _.orderBy(mqttPayload.players[players.localTeam],['points'],["desc"])
                
                mqttPayload.players[players.visitorTeam] = _.orderBy(mqttPayload.players[players.visitorTeam],['points'],["desc"])
         
                mqtt_publish(matchData.id.toString(),JSON.stringify(mqttPayload),{})



                Object.entries(allPlayers).forEach(([key, value]) => {
                    count.push(new Promise((resolve, reject) => {
                        FantasyUsersTeam.updateMany(
                            {
                                "matchId": parseInt(matchData.id),
                                [`players.${key}`]: { $exists: true }
                            },
                            [
                                {
                                    $set: {
                                        [`players.${key}.points`]: {
                                            $switch: {
                                                branches: [
                                                    { case: { $eq: [`$players.${key}.captain`, true] }, then: value.points === undefined || value.points === null ? 0 : value.points * 2 },
                                                    { case: { $eq: [`$players.${key}.viceCaptain`, true] }, then:value.points === undefined || value.points === null ? 0 : value.points * 1.5 },
                                                ],
                                                default: value.points === undefined || value.points === null ? 0 : value.points
                                            }
                                        }
                                    }
                                },
                            ]
                        ).then(response => resolve(response))
                            .catch(err => { console.log(err.message); reject({ message: "500" }) })
                    }))
                })

                console.log(chalk.redBright("Live FantasyUsersTeam update: "));

                Promise.all(count).then(response => resolve("response"))
                .catch(err => { console.log(err.message); reject(err) })

            }).catch(err => reject(err));


        }).catch(err => reject(err));
    }else{
        resolve("retry")
    }
    


})




const cronJob = require('cron').CronJob;

const job = new cronJob('*/60 * * * * *', function() {
    console.log(`${chalk.cyanBright("liveUpdate started")}`)
    
    liveCount().then().catch();


})

function mqtt_publish(topic, message, options) {
        
    console.log(chalk.bgGrey("Stats mqtt_publish: "));

    client.publish(topic, message, { qos: (options.qos) ? options.qos : 0 },(err,res) => {
 
    })
}

job.start();
liveCount().then().catch();
