
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
const { workerData } = require('worker_threads');

const axios = require('axios')
const chalk = require('chalk');

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
require('../models/UnderOverContest2');
require('../models/CustomContest');
require('../models/notification');



const Match = mongoose.model('Matches');

let Contest = mongoose.model('Contest');
let FantasyPlayer = mongoose.model('FantasyPlayer');
let FantasyUsersTeam = mongoose.model('FantasyUsersTeam');
let FantasyLeaderBoard = mongoose.model('FantasyLeaderBoard');
let FantasyContest = mongoose.model('FantasyContest');
let MatchUpContest = mongoose.model('MatchUpContest');
let UnderOverContest = mongoose.model('UnderOverContest');
let UnderOverContestType2 = mongoose.model('UnderOverContestType2');

let FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
let CustomContest = mongoose.model('CustomContest');


let User = mongoose.model('Users');
let Orders = mongoose.model('Orders');
let Notification = mongoose.model('Notification');

const payoutArr = [1.5, 2, 3, 5, 11, 26, 40, 75, 125, 250]
const payoutArr2 = [1.5, 2, 3, 5, 11, 26, 40, 75, 125, 250]//[1.5, 3, 5, 11, 26, 40, 75, 125, 250, 500]

const reducer = (accumulator, currentValue) => accumulator + currentValue;

// const countPoints = require('./countPoints')
let retry = true;

const getMatch = async (id) => {
    


    try {
        retry = false


        let matchArr = [];
        let matchUpdate = [];
        let completed = [];
        let matchId = workerData.id

        await Match.find({
            id: parseInt(workerData.id)
            
            // isLive: true,isFinished:true
        }).lean().select("id").exec().then(matches => {

            

            if (matches.length > 0) {

                matches.forEach(id => {
                    matchArr.push(new Promise((resolve, reject) => {
                        instance.get(`/fixtures/${id.id}?api_token=${process.env.Access_key}&include=batting,batting.catchstump,batting.batsman,batting.bowler,bowling.team,bowling.bowler,scoreboards,scoreboards.team,lineup,batting.batsmanout`) //,balls.catchstump
                            .then(response => {
                                if (response.data.data.status === "Finished") {

                                    completed.push(id.id);
                                    matchUpdate.push(new Promise((resolve, reject) => {
                                        Match.updateOne({ id: id.id }, { $set: { ...response.data.data, isLive: false,isCounting:false, completed: true } }, { upsert: true })
                                            .then(response => {
                                                resolve(true)
                                            }).catch(err => {
                                                reject(err);
                                            })
                                    }))
                                } else if (response.data.data.status === "Aban." || response.data.data.status === "Aban" || response.data.data.status === "Cancl" || response.data.data.status === "Cancl.") {
                                    matchUpdate.push(new Promise((resolve, reject) => {
                                        Match.updateOne({ id: id.id }, { $set: { ...response.data.data, isLive: false, completed: true } }, { upsert: true })
                                            .then(response => {
                                                resolve(true)
                                            }).catch(err => {
                                                reject(err);
                                            })
                                    }))
                                } else {
                                    matchUpdate.push(new Promise((resolve, reject) => {
                                        Match.updateOne({ id: id.id }, { $set: { ...response.data.data, isLive: true } }, { upsert: true })
                                            .then(response => {
                                                resolve(true)
                                            }).catch(err => {
                                                reject(err);
                                            })
                                    }))
                                }

                                resolve(true)
                            }).catch(err => {
                                reject(err);
                            })
                    }))
                })
            }
        })



        await Promise.all(matchArr).then(response => response)



        await Promise.all(matchUpdate).then(response => response)
        // await delay(60000);
        


        if (completed.length === 0) {
            

            retry = true
            return
        }



        // for (const id of completed) {

        //     await countPoints(matchId).then(response => response)
        // }
        
        await countPoints(matchId).then(response => response)

        console.log('countPoints: 1');

        // for (const id of completed) {
        //     await countmatchUp(id).then(response => response)
        // }
        await countmatchUp(matchId).then(response => response)

        console.log('countmatchUp: 1');

        // for (const id of completed) {
        //     await countUnderOver(id).then(response => response)
        // }
        
        await countUnderOver(matchId).then(response => response)
        console.log('countUnderOver: 1');


        // for (const id of completed) {
        //     await countUnderOver2(id).then(response => response)
        // }

        await countUnderOver2(matchId).then(response => response)

        console.log('countUnderOver2: 1');


        // for (const id of completed) {
        //     await countCustom(id).then(response => response)
        // }
        
        await countCustom(matchId).then(response => response)
        console.log('countCustom: 1');

        await Match.updateOne({
            id: parseInt(workerData.id)
        }, {
            $set: {
                pending: false,
                paid: true,
                isCounting:false,
            }
        }).then()
        console.log('updateOne: 1');

        


        retry = true





    } catch (error) {

        retry = true


    }
}


const countPoints = (id) => new Promise((resolve, reject) => {
    

    let conTyp3 = []
    let conTyp3Win = []
    let conTyp1 = []
    let conCustom = []
    let conCustom2 = []

    let count = [];

    let conTyp1Count = []
    let conTyp3Count = [];

    

    const serie = async () => {

        try {

            let matchData = await Match.findOne({ id: id })
                .lean()
                .exec()
                .then(response => response)


            if (matchData === null) {
                return resolve();
            }

            let players = await FantasyPlayer.findOne({ matchId: parseInt(matchData.id) })
                .lean()
                .exec()
                .then(response => response)



            let playerObj = matchData
            let lineUp = playerObj.lineup;
            let batting = playerObj.batting;
            let bowling = playerObj.bowling;
            let runOut = playerObj.runOut;

            let localteam_id = playerObj.localteam_id

            let visitorteam_id = playerObj.visitorteam_id


            if (matchData.type === "T20I" || matchData.type === "T20") {


                lineUp.forEach(player => {
                    let pos = player.position.name;
                    if (players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id] === undefined) {
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id] = player
                    }
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['catchStump'] = 0
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['runOut'] = 0

                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['points'] = 2
                })

                batting.forEach(player => {

                    players.players[player['team_id']][player.batsman.id]['battingScoreCard'] = player;

                    let points = player.score * 1 + player.four_x * 1 + player.six_x * 2
                    points += player.score >= 50 ? 8 : 0
                    points += player.score >= 100 ? 8 : 0


                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.score === 0) {
                            points -= 2
                        }
                    }

                    let rate =  player.ball === 0 ? 0 : (100 * player.score / player.ball).toFixed(2)

                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.ball >= 10) {
                            if (rate > 70) {

                            } else if (rate <= 70 && rate > 60) {
                                points -= 2
                            } else if (rate <= 60 && rate > 50) {
                                points -= 4
                            } else if (rate <= 50) {
                                points -= 6
                            }
                        }
                    }

                    players.players[player['team_id']][player.batsman.id]['points'] += points;

                    if (player['team_id'] === localteam_id && player.bowler !== null) {
                        players.players[visitorteam_id][player.bowler.id]['points'] += 25;

                    }

                    if (player.catchstump !== null && player['team_id'] === localteam_id  && player.bowler !== null) {
                        players.players[visitorteam_id][player.catchstump.id]['points'] += 6;

                        players.players[visitorteam_id][player.catchstump.id]['catchStump'] = players.players[visitorteam_id][player.catchstump.id]['catchStump'] ?
                            players.players[visitorteam_id][player.catchstump.id]['catchStump'] + 1 : 1
                    }

                    if (player['team_id'] === visitorteam_id && player.bowler !== null) {
                        //  

                        players.players[localteam_id][player.bowler.id]['points'] += 25;
                    }


                    if (player.catchstump !== null && player['team_id'] === visitorteam_id  && player.bowler !== null) {

                        players.players[localteam_id][player.catchstump.id]['points'] += 6;
                        players.players[localteam_id][player.catchstump.id]['catchStump'] = players.players[localteam_id][player.catchstump.id]['catchStump'] ?
                            players.players[localteam_id][player.catchstump.id]['catchStump'] + 1 : 1;
                    }


                })


                bowling.forEach(player => {



                    players.players[player['team_id']][player.bowler.id]['bowlingScoreCard'] = player;



                    let points = player.wickets === 4 ? 8 : player.wickets >= 5 ? 16 : 0;
                    points += player.medians * 8


                    let eco = 0

                    let rateEcon = (player.runs / player.overs).toFixed(2)

                    if (player.overs >= 2) {
                        if (rateEcon < 4) {
                            eco = 6
                        } else if (rateEcon < 5 && rateEcon >= 4) {
                            eco = 4
                        } else if (rateEcon < 6 && rateEcon >= 5) {
                            eco = 2
                        } else if (rateEcon < 10 && rateEcon >= 9) {
                            eco = -2
                        } else if (rateEcon < 11 && rateEcon >= 10) {
                            eco = -4
                        } else if (rateEcon >= 11) {
                            eco = -6
                        }
                    }

                    points += eco;

                    players.players[player['team_id']][player.bowler.id]['points'] += points;
                })

                if (runOut !== undefined) {
                    let rn = []
                    runOut.forEach(player => {
 

                        players.players[player['team_id']][player['player_id']]['runOut'] = players.players[player['team_id']][player['player_id']]['runOut'] + 1;

                        players.players[player['team_id']][player['player_id']]['points'] += player.runOut * 6

                        players.players[player['team_id']][player['player_id']]['catchStump'] = players.players[player['team_id']][player['player_id']]['catchStump'] ?
                        players.players[player['team_id']][player['player_id']]['catchStump'] + player.runOut : player.runOut


                    })
                }

            }

            if (matchData.type === "ODI") {


                lineUp.forEach(player => {
                    let pos = player.position.name;
                    if (players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id] === undefined) {
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id] = player
                    }
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['catchStump'] = 0
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['runOut'] = 0

                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['points'] = 2
                })

                batting.forEach(player => {

                    players.players[player['team_id']][player.batsman.id]['battingScoreCard'] = player;

                    let points = player.score * 1 + player.four_x * 1 + player.six_x * 2
                    points += player.score >= 50 ? 4 : 0
                    points += player.score >= 100 ? 4 : 0

                    let rate = (100 * player.score / player.ball).toFixed(2)

                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.score === 0) {
                            points -= 4
                        }
                    }


                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.ball >= 20) {
                            if (rate > 70) {

                            } else if (rate <= 60 && rate >= 50) {
                                points -= 2
                            } else if (rate <= 49.9 && rate >= 40) {
                                points -= 4
                            } else if (rate <= 39.99) {
                                points -= 6
                            }
                        }
                    }

                    players.players[player['team_id']][player.batsman.id]['points'] += points;


                    if (player['team_id'] === localteam_id && player.bowler !== null) {
                        players.players[visitorteam_id][player.bowler.id]['points'] += 25;

                    }

                    if (player.catchstump !== null && player['team_id'] === localteam_id) {
                        players.players[visitorteam_id][player.catchstump.id]['points'] += 6;

                        players.players[visitorteam_id][player.catchstump.id]['catchStump'] = players.players[visitorteam_id][player.catchstump.id]['catchStump'] ?
                            players.players[visitorteam_id][player.catchstump.id]['catchStump'] + 1 : 1
                    }

                    if (player['team_id'] === visitorteam_id && player.bowler !== null) {
                        //  

                        players.players[localteam_id][player.bowler.id]['points'] += 25;
                    }


                    if (player.catchstump !== null && player['team_id'] === visitorteam_id) {
                        players.players[localteam_id][player.catchstump.id]['points'] += 6;
                        players.players[localteam_id][player.catchstump.id]['catchStump'] = players.players[localteam_id][player.catchstump.id]['catchStump'] ?
                            players.players[localteam_id][player.catchstump.id]['catchStump'] + 1 : 1;
                    }




                })


                bowling.forEach(player => {



                    players.players[player['team_id']][player.bowler.id]['bowlingScoreCard'] = player;



                    let points = player.wickets === 4 ? 8 : player.wickets >= 5 ? 16 : 0;
                    points += player.medians * 8


                    let eco = 0
                    let rateEcon = (player.runs / player.overs).toFixed(2)

                    if (player.overs >= 5) {
                        if (rateEcon < 2.5) {
                            eco = 6
                        } else if (rateEcon < 2.5 && rateEcon >= 3.49) {
                            eco = 4
                        } else if (rateEcon < 3.5 && rateEcon >= 4.5) {
                            eco = 2
                        } else if (rateEcon < 7 && rateEcon >= 7.99) {
                            eco = -2
                        } else if (rateEcon < 8 && rateEcon >= 8.99) {
                            eco = -4
                        } else if (rateEcon >= 9) {
                            eco = -6
                        }
                    }

                    points += eco;

                    players.players[player['team_id']][player.bowler.id]['points'] += points;
                })

                if (runOut !== undefined) {
 
                    runOut.forEach(player => {
 

                        players.players[player['team_id']][player['player_id']]['runOut'] = players.players[player['team_id']][player['player_id']]['runOut'] + 1;

                        players.players[player['team_id']][player['player_id']]['catchStump'] = players.players[player['team_id']][player['player_id']]['catchStump'] ?
                        players.players[player['team_id']][player['player_id']]['catchStump'] + 1 : 1

                        
                        players.players[player['team_id']][player.player_id]['points'] += player.runOut * 6
                    })
                }
            }

            if (matchData.type === "4day" || matchData.type === 'Test/5day' || matchData.type === '5day' || matchData.type === 'Test') {


                lineUp.forEach(player => {
                    let pos = player.position.name;
                    if (players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id] === undefined) {
                        players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id] = player
                    }
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['catchStump'] = 0
 
                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['runOut'] = 0

                    players.players[(parseInt(player['lineup']['team_id'])).toString()][player.id]['points'] = 2
                })

                batting.forEach(player => {

                    players.players[player['team_id']][player.batsman.id]['battingScoreCard'] = player;

                    let points = player.score * 1 + player.four_x * 1 + player.six_x * 2
                    points += player.score >= 50 ? 4 : 0
                    points += player.score >= 100 ? 4 : 0


                    if (player.batsman.position.id === 1 || player.batsman.position.id === 4 || player.batsman.position.id === 3) {
                        if (player.score === 0) {
                            points -= 4
                        }
                    }




                    players.players[player['team_id']][player.batsman.id]['points'] += points;


                    if (player['team_id'] === localteam_id && player.bowler !== null) {
                        players.players[visitorteam_id][player.bowler.id]['points'] += 20;

                    }

                    if (player.catchstump !== null && player['team_id'] === localteam_id) {
                        players.players[visitorteam_id][player.catchstump.id]['points'] += 3;

                        players.players[visitorteam_id][player.catchstump.id]['catchStump'] = players.players[visitorteam_id][player.catchstump.id]['catchStump'] ?
                            players.players[visitorteam_id][player.catchstump.id]['catchStump'] + 1 : 1
                    }

                    if (player['team_id'] === visitorteam_id && player.bowler !== null) {
                        //  

                        players.players[localteam_id][player.bowler.id]['points'] += 20;
                    }


                    if (player.catchstump !== null && player['team_id'] === visitorteam_id) {
                        players.players[localteam_id][player.catchstump.id]['points'] += 3;
                        players.players[localteam_id][player.catchstump.id]['catchStump'] = players.players[localteam_id][player.catchstump.id]['catchStump'] ?
                            players.players[localteam_id][player.catchstump.id]['catchStump'] + 1 : 1;
                    }




                })


                bowling.forEach(player => {



                    players.players[player['team_id']][player.bowler.id]['bowlingScoreCard'] = player;



                    let points = player.wickets === 4 ? 4 : player.wickets >= 5 ? 8 : 0;
                    points += player.medians * 4


                    let eco = 0



                    points += eco;

                    players.players[player['team_id']][player.bowler.id]['points'] += points;
                })

                if (runOut !== undefined) {
                    runOut.forEach(player => {
 

                        players.players[player['team_id']][player['player_id']]['runOut'] = players.players[player['team_id']][player['player_id']]['runOut'] + 1;

                        players.players[player['team_id']][player.player_id]['points'] += player.runOut * 3
                 

                        players.players[player['team_id']][player['player_id']]['catchStump'] = players.players[player['team_id']][player['player_id']]['catchStump'] ?
                        players.players[player['team_id']][player['player_id']]['catchStump'] + 1 : 1

                    })
                }
            }

            await FantasyPlayer.updateOne({ matchId: parseInt(matchData.id) }, players)
                .then(response => {

                })



            let allPlayers = {
                ...players.players[players.localTeam], ...players.players[players.visitorTeam]
            }


            Object.entries(allPlayers).forEach(([key, value], index) => {


                // contestType 3: Matchups contest
                conTyp3.push(new Promise((resolve, reject) => {
                    Contest.updateMany(
                        {
                            "matchId": parseInt(matchData.id),
                            "contestType": 3,
                            "player1": parseInt(key),
                            [`players.${key}`]: { $exists: true },
                            "status": { $ne: "Discarded" }
                        },
                        [
                            {
                                $set: {
                                    [`players.${key}.points`]: value.points,
                                    player1Points:value.points
                                }
                            },
                            // {
                            //     $set: {
                            //         'highestPoint': {
                            //             $switch: {
                            //                 branches: [
                            //                     { case: { $lt: ["$highestPoint", value.points] }, then: value.points },
                            //                     { case: { $eq: ["$highestPoint", value.points] }, then: value.points },
                            //                 ],
                            //                 default: '$highestPoint'
                            //             }
                            //         }
                            //     }
                            // },
                            // {
                            //     $set: {
                            //         'winner': {
                            //             $cond: {
                            //                 if: { $eq: ["$highestPoint", value.points] }, then: parseInt(key),
                            //                 else: "$winner"
                            //             }
                            //         }
                            //     }
                            // },
                             
                        ]
                    ).exec().then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

                conTyp3.push(new Promise((resolve, reject) => {
                    Contest.updateMany(
                        {
                            "matchId": parseInt(matchData.id),
                            "contestType": 3,
                            "player2": parseInt(key),
                            [`players.${key}`]: { $exists: true },
                            "status": { $ne: "Discarded" }
                        },
                        [
                            {
                                $set: {
                                    [`players.${key}.points`]: value.points,
                                    player2Points:value.points
                                }
                            },
                            // {
                            //     $set: {
                            //         'highestPoint': {
                            //             $switch: {
                            //                 branches: [
                            //                     { case: { $lt: ["$highestPoint", value.points] }, then: value.points },
                            //                     { case: { $eq: ["$highestPoint", value.points] }, then: value.points },
                            //                 ],
                            //                 default: '$highestPoint'
                            //             }
                            //         }
                            //     }
                            // },
                            // {
                            //     $set: {
                            //         'winner': {
                            //             $cond: {
                            //                 if: { $eq: ["$highestPoint", value.points] }, then: parseInt(key),
                            //                 else: "$winner"
                            //             }
                            //         }
                            //     }
                            // },
                             
                        ]
                    ).exec().then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

                conTyp3Win.push(new Promise((resolve, reject) => {
                    Contest.updateMany(
                        {
                            "matchId": parseInt(matchData.id),
                            "contestType": 3,
                            "status": { $ne: "Discarded" }
                        },
                        [
                            {
                                $set: {
                                    winner: {
                                        $switch: {
                                            branches: [
                                                { case: { $gt: ["$player1Points", "$player2Points"] }, then: "$player1" },
                                                { case: { $gt: ["$player2Points", "$player1Points"] }, then: "$player2" },
                                            ],
                                            default: "$handicap"
                                        }
                                    }
                                }
                            }

                            // {
                            //     $set: {
                            //         'highestPoint': {
                            //             $switch: {
                            //                 branches: [
                            //                     { case: { $lt: ["$highestPoint", value.points] }, then: value.points },
                            //                     { case: { $eq: ["$highestPoint", value.points] }, then: value.points },
                            //                 ],
                            //                 default: '$highestPoint'
                            //             }
                            //         }
                            //     }
                            // },
                            // {
                            //     $set: {
                            //         'winner': {
                            //             $cond: {
                            //                 if: { $eq: ["$highestPoint", value.points] }, then: parseInt(key),
                            //                 else: "$winner"
                            //             }
                            //         }
                            //     }
                            // },
                             
                        ]
                    ).exec().then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

                //contestType 1: UnderOverContest
                conTyp1.push(new Promise((resolve, reject) => {
                    Contest.updateMany(
                        {
                            "matchId": parseInt(matchData.id),
                            "contestType": 1,
                            [`playerInfo.id`]: parseInt(key),
                            "status": { $ne: "Discarded" }
                        },
                        [
                            {
                                $set: {
                                    winner: {
                                        $switch: {
                                            branches: [
                                                { case: { $eq: ["$type", 1] }, then: value.battingScoreCard ? value.battingScoreCard.score : 0 },
                                                { case: { $eq: ["$type", 2] }, then: value.bowlingScoreCard ? value.bowlingScoreCard.wickets : 0 },
                                                { case: { $eq: ["$type", 3] }, then: value.points ? value.points : 0 },
                                            ],
                                            default: value.points
                                        }
                                    }
                                },
                            },
                            {
                                $set: {
                                    'winnerType': {
                                        $switch: {
                                            branches: [
                                                { case: { $lte: ["$winner", "$value1"] }, then: 1 },
                                                { case: { $and: [{ $gt: ["$winner", "$value1"] }, { $lte: ["$winner", "$value2"] }] }, then: 2 },
                                                { case: { $gt: ["$winner", "$value2"] }, then: 3 },
                                            ],
                                            default: 'N/A'
                                        }
                                    }
                                }
                            },
                        ]
                    ).exec().then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

                //contestType 1b: UnderOverContestType2
                conTyp1.push(new Promise((resolve, reject) => {
                    Contest.updateMany(
                        {
                            "matchId": parseInt(matchData.id),
                            "contestType": 2,
                            [`playerInfo.id`]: parseInt(key),
                            "status": { $ne: "Discarded" }
                        },
                        [
                            {
                                $set: {
                                    winner: {
                                        $switch: {
                                            branches: [
                                                { case: { $eq: ["$type", 1] }, then: value.battingScoreCard ? value.battingScoreCard.score : 0 },
                                                { case: { $eq: ["$type", 2] }, then: value.bowlingScoreCard ? value.bowlingScoreCard.wickets : 0 },
                                                { case: { $eq: ["$type", 3] }, then: value.points ? value.points : 0 },
                                            ],
                                            default: value.points
                                        }
                                    }
                                },
                            },
                            {
                                $set: {
                                    'winnerType': {
                                        $switch: {
                                            branches: [
                                                { case: { $lte: ["$winner", "$value"] }, then: 1 },
                                                // { case: { $and: [{ $gt: ["$winner", "$value1"] }, { $lte: ["$winner", "$value2"] }] }, then: 2 },
                                                { case: { $gt: ["$winner", "$value"] }, then: 2 },
                                            ],
                                            default: 'N/A'
                                        }
                                    }
                                }
                            },
                        ]
                    ).exec().then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

                //conCustom
                conCustom.push(new Promise((resolve, reject) => {
                    CustomContest.updateMany({
                        "matchId": parseInt(matchData.id),
                        "contestType": 6,
                        open: false,
                        "player1": parseInt(key),
                        "status": { $ne: "Discarded" }
                    }, {
                        $set: {
                            "player1Points": value.points,
                        }
                    }).then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

                conCustom.push(new Promise((resolve, reject) => {
                    CustomContest.updateMany({
                        "matchId": parseInt(matchData.id),
                        "contestType": 6,
                        open: false,
                        "player2": parseInt(key),
                        "status": { $ne: "Discarded" }
                    }, {
                        $set: {
                            "player2Points": value.points,
                        }
                    }).then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))



                conCustom2.push(new Promise((resolve, reject) => {
                    CustomContest.updateMany({
                        "matchId": parseInt(matchData.id),
                        "contestType": 5,
                        "playerId": parseInt(key),
                        open: false,
                        "status": { $ne: "Discarded" }
                    }, [
                        {
                            $set: {
                                "playerPoints": value.points,
                            }
                        },
                        {
                            $set: {
                                winnerType: {
                                    $switch: {
                                        branches: [
                                            {
                                                case: {
                                                    $and: [
                                                        { $lte: ["$playerPoints", "$value"] },
                                                        { $eq: ["$player1", 1] }
                                                    ]
                                                }, then: 1
                                            },
                                            {
                                                case: {
                                                    $and: [
                                                        { $gte: ["$playerPoints", "$value"] },
                                                        { $eq: ["$player1", 2] }
                                                    ]
                                                }, then: 2
                                            },
                                            {
                                                case: {
                                                    $and: [
                                                        { $lt: ["$playerPoints", "$value"] },
                                                        { $eq: ["$player2", 1] }
                                                    ]
                                                }, then: 1
                                            },
                                            {
                                                case: {
                                                    $and: [
                                                        { $gt: ["$playerPoints", "$value"] },
                                                        { $eq: ["$player2", 2] }
                                                    ]
                                                }, then: 2
                                            },
                                            // { case: { $gt: ["$playerPoints", value.points] }, then: 2 },
                                        ],
                                        default: 3
                                    }
                                }
                            }
                        },
                        {
                            $set: {
                                winner: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ["$winnerType", "$player1"] }, then: "$users.player1" },
                                            { case: { $eq: ["$winnerType", "$player2"] }, then: "$users.player2" },
                                        ],
                                        default: "$users.player1"
                                    }
                                }
                            }
                        }
                    ]).exec().then(response => resolve(response)).catch(err => {
                        reject(err);
                    })
                }))

            })


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
                                                { case: { $eq: [`$players.${key}.viceCaptain`, true] }, then: value.points === undefined || value.points === null ? 0 : value.points * 1.5 },
                                            ],
                                            default: value.points === undefined || value.points === null ? 0 : value.points
                                        }
                                    }
                                }
                            },
                        ]
                    )
                        .then(response => resolve(response))
                        .catch(err => {

                            reject({ message: "500" })
                        })
                }))
            })

            await Promise.all(conTyp1).then(response => {
                

            })
            console.log('conTyp1: 1');
            await Promise.all(conTyp3).then(response => {

            })
            console.log('conTyp3: 2');

            await Promise.all(conTyp3Win).then(response => {

            })
            console.log('conTyp3Win: 3');

            await Promise.all(count).then(response => {

            })
            console.log('count: 4');

            await Promise.all(conCustom).then(response => {

            })
            console.log('conCustom: 5');

            await Promise.all(conCustom2).then(response => {

            })
            console.log('conCustom2: 6');



            await CustomContest.updateMany({
                "matchId": parseInt(matchData.id),
                "contestType": 6,
                open: false,
                "status": { $ne: "Discarded" }
            }, [
                {
                    $set: {
                        winner: {
                            $switch: {
                                branches: [
                                    { case: { $gt: ["$player1Points", "$player2Points"] }, then: "$users.player1" },
                                    { case: { $gt: ["$player2Points", "$player1Points"] }, then: "$users.player2" },
                                ],
                                default: "$handicap"
                            }
                        }
                    }
                }
            ]).exec().then(response => response).catch(err => {
                console.log('err: 1068', err);
                reject(err);
            })
            console.log('CustomContest.updateMany: 7');

            let ContestType1 = await Contest.find({ matchId: id, contestType: 1 }).lean().exec().then(response => response).catch(err => {
                console.log('err: 1074', err);

                reject(err);
            })

            let ContestType2 = await Contest.find({ matchId: id, contestType: 2 }).lean().exec().then(response => response).catch(err => {
                console.log('err: 1080', err);

            })

            let ContestType3 = await Contest.find({ matchId: id, contestType: 3 }).lean().exec().then(response => response).catch(err => {
                console.log('err: 1085', err);

            })






            for (let index = 0, len = ContestType1.length; index < len; index++) {
                const contest = ContestType1[index];

                conTyp1Count.push(new Promise((resolve, reject) => {

                    if (contest.status === "Discarded") {
                        UnderOverContest.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: 3
                                },
                            },
                            {
                                $set: {
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err));
                    } else {

                        UnderOverContest.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: {
                                        $cond: {
                                            if: { $eq: [`$selectedTeam.${contest._id}.selectedType`, contest.winnerType] }, then: 1,
                                            else: 0,
                                        }
                                    },

                                }
                            },
                            {
                                $set: {
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err))

                    }
                }))

            }
            console.log('ContestType1: 8');

            for (let index = 0, len = ContestType2.length; index < len; index++) {
                const contest = ContestType2[index];


                conTyp1Count.push(new Promise((resolve, reject) => {

                    if (contest.status === "Discarded") {
                        UnderOverContestType2.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: 3
                                },
                            },
                            {
                                $set: {
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err));
                    } else {

                        UnderOverContestType2.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: {
                                        $cond: {
                                            if: { $eq: [`$selectedTeam.${contest._id}.selectedType`, contest.winnerType] }, then: 1,
                                            else: 0,
                                        }
                                    },

                                }
                            },
                            {
                                $set: {
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err))

                    }
                }))

            }
            console.log('ContestType2: 9');


            for (let index = 0, len = ContestType3.length; index < len; index++) {
                const contest = ContestType3[index];
                let p1 = contest.player1.toString();
                let p2 = contest.player2.toString();

                conTyp3Count.push(new Promise((resolve, reject) => {

                    if (contest.players[p1].points !== contest.players[p2].points && contest.status !== "Discarded") {
                        MatchUpContest.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: {

                                        $cond: {
                                            if: { $eq: [`$selectedTeam.${contest._id}.selectedPlayer`, contest.winner] }, then: 1,
                                            else: 0,
                                        }

                                    }
                                },
                            },
                            {
                                $set: {
                                    players: contest.players,
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err));
                    }

                    if (contest.players[p1].points === contest.players[p2].points && contest.status !== "Discarded") {
                        MatchUpContest.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: {

                                        $cond: {
                                            if: { $eq: [`$selectedTeam.${contest._id}.selectedPlayer`, contest.handicap] }, then: 1,
                                            else: 0,
                                        }

                                    }
                                },
                            },
                            {
                                $set: {
                                    [`players.${p1}`]: contest.players[p1],
                                    [`players.${p2}`]: contest.players[p2],
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err));
                    }


                    if (contest.status === "Discarded") {
                        MatchUpContest.updateMany({
                            matchId: contest.matchId,
                            [`selectedTeam.${contest._id}`]: { $exists: true },
                        }, [
                            {
                                $set: {
                                    [`winner.${contest._id}`]: 3
                                },
                            },
                            {
                                $set: {
                                    [`players.${p1}`]: contest.players[p1],
                                    [`players.${p2}`]: contest.players[p2],
                                    [`contest.${contest._id}`]: contest
                                }
                            },
                        ]).then(response => {
                            resolve(true)
                        }).catch(err => reject(err));
                    }


                }))


            }

            console.log('ContestType3: 10');


            await Promise.all(conTyp1Count).then(resp => {

            })
            console.log('ContestType3: 11');

            await Promise.all(conTyp3Count).then(resp => {
                resolve()
            })
            console.log('ContestType3: 12');

            


            

        } catch (error) {
            reject(error)
        }
    }


    serie().then(resp => {}).catch(err => {
        
        reject(err)});

})

const countmatchUp = (id) => new Promise((resolve, reject) => {

    

    async function updateMatchUp() {

        try {
            await MatchUpContest.find({ matchId: id, aban: { $ne: true } })
                .lean()
                .cursor()
                .eachAsync(async function (doc, i) {
                    try {
                        await dispatchWinMatchUp(doc).then(response => response)
                    } catch (error) {
                        return error
                    }
                })
        } catch (error) {
            
            return error
        }
    }

    updateMatchUp().then(response => resolve(response)).catch(err => reject(err))

})

const countUnderOver = (id) => new Promise((resolve, reject) => {
    


    async function updateUnderOver() {


        await UnderOverContest.find({ matchId: id })
            .lean()
            .cursor()
            .eachAsync(async function (doc, i) {

                await dispatchWinUnderOver(doc).then(response => response)

            })




    }

    updateUnderOver().then(response => resolve(response)).catch(err => reject(err))

})

const countUnderOver2 = (id) => new Promise((resolve, reject) => {
    


    async function updateUnderOver() {

        // let allUnderOverContest = await UnderOverContest.find({ matchId: id, aban: { $ne: true } })
        //     .lean()
        //     .exec()
        //     .then(response => response)

        await UnderOverContestType2.find({ matchId: id, aban: { $ne: true } })
            .lean()
            .cursor()
            .eachAsync(async function (doc, i) {

                await dispatchWinUnderOver2(doc).then(response => response)

            })


        // for (const con of allUnderOverContest) {
        //     

        //     await dispatchWinUnderOver(con).then(response => response)
        // }


    }

    updateUnderOver().then(response => resolve(response)).catch(err => reject(err))

})

const countCustom = (id) => new Promise((resolve, reject) => {
    

    async function updateUnderOver() {

        // let allUnderOverContest = await UnderOverContest.find({ matchId: id, aban: { $ne: true } })
        //     .lean()
        //     .exec()
        //     .then(response => response)

        await CustomContest.find({ matchId: id, contestType: 5 })
            .lean()
            .cursor()
            .eachAsync(async function (doc, i) {

                await dispatchCustom(doc).then(response => response)

            })

        await CustomContest.find({ matchId: id, contestType: 6 })
            .lean()
            .cursor()
            .eachAsync(async function (doc, i) {

                await dispatchCustomDuel(doc).then(response => response)

            })


        // for (const con of allUnderOverContest) {
        //     

        //     await dispatchWinUnderOver(con).then(response => response)
        // }


    }

    updateUnderOver().then(response => resolve(response)).catch(err => reject(err))

})

const countFantasy = (id) => new Promise((resolve, reject) => {

    

    async function updateUnderOver() {

        let fantasyContest = await FantasyContest.find({ matchId: parseInt(id),status:{
            $ne:"Discarded"
        } })
            .lean()
            .exec()
            .then(response => response)





        for (const contest of fantasyContest) {
            await leader(contest).then(response => response)
        }

        //  await delay(120000)

        for (const contest of fantasyContest) {
            await dispatchFantasy(contest).then(response => response)
        }

        await FantasyContest.find({ matchId: parseInt(id),status:"Discarded"})
        .lean()
        .cursor()
        .eachAsync(async function (doc, i) {
            

            await FantasyJoinedUsers.find({ contestId: mongoose.mongo.ObjectID(doc._id.toString()) })
                .lean()
                .cursor()
                .eachAsync(async function (doc2, i) {

                    await User.updateOne({
                        _id: mongoose.mongo.ObjectID(doc2.userId.toString())
                    }, {
                        $inc: {
                            "wallet.balance": doc.entryFee
                        }
                    }).then()

                    let order1 = new Orders({
                        "amount": doc.entryFee * 100,
                        "status": "contest_credit",
                        "matchId": req.body.matchId,
                        "contestType": 4,
                        "orderId": "Fantasy11 Refund: Contest Cancelled ",
                        "notes": {
                            "userId": doc2.userId.toString()
                        }
                    })

                    await order1.save().then()

                }).then()



        }).then()
 


    }

    updateUnderOver().then(response => resolve(response)).catch(err => reject(err))

})

const dispatchWinMatchUp = (con) => new Promise((resolve, reject) => {
    let win = true;

    

    if (con.winner === null || con.winner === undefined) {
        resolve("No winner")
    } else {
        let length = 0;
        let tax = 1

        Object.entries(con.winner).forEach(([key, value]) => {
            if (value === 0) {
                win = false
            }
            if (value === 1) {
                length += 1
            }
        })
        if (win === true && length >= 1) {
            console.log('con: ', mongoose.mongo.ObjectID((con.userId).toString()));

            let payout = Object.keys(con.winner).length;
            payout = payoutArr[length - 1];

            if (payout * con.amount > 10000) {
                tax = 0.7
            }

            User.updateOne({ _id: mongoose.mongo.ObjectID((con.userId).toString()), },
                {
                    $inc: {
                        'wallet.balance': (payout * con.amount * tax).toFixed(2),
                        messageCount: 1,
                        "wallet.withdrawal": con.amount,
                        'stats.profit': (payout * con.amount * tax).toFixed(2),
                        'stats.loss': -con.amount
                    }
                }).then(response => {
                    console.log('response: ', response);
                    let order = new Orders({
                        "amount": payout * tax * con.amount * 100,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 3,
                        "orderId": "Combo Duels: " + payout + "x Payout",
                        "notes": {
                            "userId": (con.userId).toString()
                        }
                    })

                    // let notf = new Notification({
                    //     "amount": payout*tax * con.amount,
                    //     "matchId": con.matchId,
                    //     title:"Congrats! You won",
                    //     "message": "You won "+ payout*tax * con.amount,
                    //     "userId": (con.userId)
                    // })

                    // notf.save().then().catch()

                    order.save().then().catch()
                    resolve()
                }).catch(err => reject(err))




        } else if (win === true && length === 0) {
            User.updateOne({ _id: mongoose.mongo.ObjectID(con.userId) },
                {
                    $inc: {
                        'wallet.balance': con.amount,
                        messageCount: 1,

                        'stats.loss': -con.amount
                    }
                }).then(response => {
                    let order = new Orders({
                        "amount": con.amount * 100,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 3,
                        "orderId": "Combo Duels Refund: Contest Cancelled ",
                        "notes": {
                            "userId": (con.userId).toString()
                        }
                    })

                    // let notf = new Notification({
                    //     "amount": con.amount,
                    //     "matchId": con.matchId,
                    //     title:"Contest Cancelled",
                    //     "message": "Your amount has been refunded",
                    //     "userId": (con.userId)
                    // })

                    // notf.save().then().catch()

                    order.save().then().catch()

                    resolve("No winner")
                }).catch(err => reject(err))

        } else {
            resolve("No winner")
        }
    }
})


const dispatchWinUnderOver = (con) => new Promise((resolve, reject) => {
   
    let win = true;
    if (con.winner !== null && con.winner !== undefined) {
        let length = 0;
        let tax = 1


        Object.entries(con.winner).forEach(([key, value]) => {
            if (value === 0) {
                win = false
            }
            if (value === 1) {
                length += 1
            }
        })
        if (win === true && length >= 1) {



            let payout = Object.keys(con.winner).length;

            payout = payoutArr2[length - 1];

            if (payout * con.amount > 10000) {
                tax = 0.7
            }

            User.updateOne({ _id: mongoose.mongo.ObjectID(con.userId) },
                {
                    $inc: {
                        'wallet.balance': (payout * con.amount * tax).toFixed(2),
                        messageCount: 1,
                        'stats.profit': (payout * con.amount * tax).toFixed(2),
                        'stats.loss': -con.amount
                    }
                }).then(response => {
                    let order = new Orders({
                        "amount": payout * con.amount * 100 * tax,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 1,
                        "orderId": "1/3 Under/Over: " + payout + "x Payout",
                        "notes": {
                            "userId": (con.userId).toString()
                        }
                    })

                    // let notf = new Notification({
                    //     "amount": payout*tax * con.amount,
                    //     "matchId": con.matchId,
                    //     title:"Congrats! You won",
                    //     "message": "You won "+ payout*tax * con.amount,
                    //     "userId": (con.userId)
                    // })

                    // notf.save().then().catch()



                    order.save().then().catch()
                    resolve(true)
                }).catch(err => reject(err))




        } else if (win === true && length === 0) {


            User.updateOne({ _id: mongoose.mongo.ObjectID(con.userId) },
                {
                    $inc: {
                        'wallet.balance': con.amount,
                        messageCount: 1,
                        "wallet.withdrawal": con.amount,
                        'stats.loss': -con.amount
                    }
                }).then(response => {
                    let order = new Orders({
                        "amount": con.amount * 100,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 1,
                        "orderId": "Under/Over Refund: Contest Cancelled ",
                        "notes": {
                            "userId": (con.userId).toString()
                        }
                    })

                    // let notf = new Notification({
                    //     "amount": con.amount,
                    //     "matchId": con.matchId,
                    //     title:"Contest Cancelled",
                    //     "message": "Your amount has been refunded",
                    //     "userId": (con.userId)
                    // })

                    // notf.save().then().catch()

                    order.save().then().catch();
                    resolve(true)
                }).catch(err => reject(err))

        } else {
            resolve(true)
        }
    } else {
        resolve(true)
    }
})

const dispatchWinUnderOver2 = (con) => new Promise((resolve, reject) => {
    let win = true;
    


    if (con.winner !== null && con.winner !== undefined) {
        let length = 0;
        let tax = 1


        Object.entries(con.winner).forEach(([key, value]) => {
            if (value === 0) {
                win = false
            }
            if (value === 1) {
                length += 1
            }
        })
        if (win === true && length >= 1) {



            let payout = Object.keys(con.winner).length;

            payout = payoutArr2[length - 1];

            if (payout * con.amount > 10000) {
                tax = 0.7
            }

            User.updateOne({ _id: mongoose.mongo.ObjectID(con.userId) },
                {
                    $inc: {
                        'wallet.balance': (payout * con.amount * tax).toFixed(2),
                        messageCount: 1,
                        'stats.profit': (payout * con.amount * tax).toFixed(2),
                        'stats.loss': -con.amount
                    }
                }).then(response => {
                    let order = new Orders({
                        "amount": payout * con.amount * 100 * tax,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 1,
                        "orderId": "1/2 Under/Over: " + payout + "x Payout",
                        "notes": {
                            "userId": (con.userId).toString()
                        }
                    })

                    // let notf = new Notification({
                    //     "amount": payout*tax * con.amount,
                    //     "matchId": con.matchId,
                    //     title:"Congrats! You won",
                    //     "message": "You won "+ payout*tax * con.amount,
                    //     "userId": (con.userId)
                    // })

                    // notf.save().then().catch()



                    order.save().then().catch()
                    resolve(true)
                }).catch(err => reject(err))




        } else if (win === true && length === 0) {


            User.updateOne({ _id: mongoose.mongo.ObjectID(con.userId) },
                {
                    $inc: {
                        'wallet.balance': con.amount.toFixed(2),
                        messageCount: 1,
                        "wallet.withdrawal": con.amount.toFixed(2),
                        'stats.loss': -con.amount.toFixed(2)
                    }
                }).then(response => {
                    let order = new Orders({
                        "amount": con.amount * 100,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 1,
                        "orderId": "1/2 Under/Over Refund: Contest Cancelled ",
                        "notes": {
                            "userId": (con.userId).toString()
                        }
                    })

                    // let notf = new Notification({
                    //     "amount": con.amount,
                    //     "matchId": con.matchId,
                    //     title:"Contest Cancelled",
                    //     "message": "Your amount has been refunded",
                    //     "userId": (con.userId)
                    // })

                    // notf.save().then().catch()

                    order.save().then().catch();
                    resolve(true)
                }).catch(err => reject(err))

        } else {
            resolve(true)
        }
    } else {
        resolve(true)
    }
})

const dispatchCustom = (con) => new Promise((resolve, reject) => {
    


    if (con.open === true) {
        User.updateOne({ _id: con.users.player1 },
            {
                $inc: {
                    'wallet.balance': con.amount.toFixed(2),
                    messageCount: 1,
                    'stats.loss': -con.amount.toFixed(2)
                }
            }).then(response => {
                let order1 = {
                    "amount": con.amount * 100,
                    "status": "contest_credit",
                    "matchId": con.matchId,
                    "contestType": 5,
                    "orderId": "Custom Duels Refund: Contest Cancelled ",
                    "notes": {
                        "userId": (con.users.player1).toString()
                    }
                }



                Orders.insertMany([
                    order1
                ]).then(response => resolve(response)).catch(err => {

                    reject(err)
                })

            }).catch(err => {

                reject(err)
            })

    } else if (con.status === 'Discarded' && con.open === false) {


        User.updateOne({_id: con.users.player1},
            {
                $inc: {
                    'wallet.balance': con.amount.toFixed(2),
                    messageCount: 1,
                    'stats.loss': -con.amount.toFixed(2)
                }
            }).then(response => {
                User.updateOne({_id: con.users.player2},
                    {
                        $inc: {
                            'wallet.balance': con.amount.toFixed(2),
                            messageCount: 1,
                            'stats.loss': -con.amount.toFixed(2)
                        }
                    }).then(response => {
                        let order1 = {
                            "amount": con.amount * 100,
                            "status": "contest_credit",
                            "matchId": con.matchId,
                            "contestType": 5,
                            "orderId": "Custom Duels Refund: Contest Cancelled ",
                            "notes": {
                                "userId": (con.users.player1).toString()
                            }
                        }
        
                        let order2 = {
                            "amount": con.amount * 100,
                            "status": "contest_credit",
                            "matchId": con.matchId,
                            "contestType": 5,
                            "orderId": "Custom Duels Refund: Contest Cancelled ",
                            "notes": {
                                "userId": (con.users.player2).toString()
                            }
                        }
        
                        Orders.insertMany([
                            order1, order2
                        ]).then(response => resolve(response))
        
                    }).catch(err => reject(err))



            }).catch(err => reject(err))

            

    } else {
        User.updateOne({
            _id: con.winner
        }, {
            $inc: {
                'wallet.balance': con.totalAmount.toFixed(2),
                messageCount: 1,
                "wallet.withdrawal": con.totalAmount.toFixed(2),
                'stats.profit': con.totalAmount.toFixed(2),
                'stats.loss': -con.amount.toFixed(2)
            }
        }).then(response => {
            let order = new Orders({
                "amount": con.totalAmount * 100,
                "status": "contest_credit",
                "matchId": con.matchId,
                "contestType": 5,
                "orderId": "Custom Duels Winner",
                "notes": {
                    "userId": (con.winner).toString()
                }
            })

            // let notf = new Notification({
            //     "amount": con.totalAmount,
            //     "matchId": con.matchId,
            //     title:"Congrats! You won against ₹" + con.totalAmount,
            //     "message": "You won ₹"+ payout*tax * con.amount,
            //     "userId": (con.userId)
            // })

            // notf.save().then().catch()



            order.save().then(response => resolve(response)).catch(err => reject(err))
        })
    }

})

const dispatchCustomDuel = (con) => new Promise((resolve, reject) => {
    


    if (con.open === true) {
        User.updateOne({ _id: con.users.player1 },
            {
                $inc: {
                    'wallet.balance': con.amount.toFixed(2),
                    'stats.loss': -con.amount.toFixed(2)
                }
            }).then(response => {
                let order1 = {
                    "amount": con.amount * 100,
                    "status": "contest_credit",
                    "matchId": con.matchId,
                    "contestType": 6,
                    "orderId": "Custom Duels Refund: Contest Cancelled ",
                    "notes": {
                        "userId": (con.users.player1).toString()
                    }
                }

                // let order2 = {
                //     "amount": con.amount * 100,
                //     "status": "contest_credit",
                //     "matchId": con.matchId,
                //     "contestType": 5,
                //     "orderId": "Custom Duels Refund: Contest Cancelled ",
                //     "notes": {
                //         "userId": ( con.users.player2).toString()
                //     }
                // } 

                Orders.insertMany([
                    order1
                ]).then(response => resolve(response))

            }).catch(err => reject(err))
    } else if (con.status === 'Discarded' && con.open === false) {

        if(con.notPlaying1 === con.player1 && con.notPlaying2 === con.player2){
            User.updateOne({ _id: con.users.player1 },
                {
                    $inc: {
                        'wallet.balance': con.amount.toFixed(2),
                        'stats.loss': -con.amount.toFixed(2)
                    }
                }).then(response => {
                    User.updateOne({ _id: con.users.player2 },
                        {
                            $inc: {
                                'wallet.balance': con.amount.toFixed(2),
                                'stats.loss': -con.amount.toFixed(2)
                            }
                        }).then(response => {
                            let order1 = {
                                "amount": con.amount * 100,
                                "status": "contest_credit",
                                "matchId": con.matchId,
                                "contestType": 6,
                                "orderId": "Custom Duels Refund: Contest Cancelled ",
                                "notes": {
                                    "userId": (con.users.player1).toString()
                                }
                            }
            
                            let order2 = {
                                "amount": con.amount * 100,
                                "status": "contest_credit",
                                "matchId": con.matchId,
                                "contestType": 6,
                                "orderId": "Custom Duels Refund: Contest Cancelled ",
                                "notes": {
                                    "userId": ( con.users.player2).toString()
                                }
                            } 
            
                            Orders.insertMany([
                                order1,order2
                            ]).then(response => resolve(response))
                        })

    
                }).catch(err => reject(err))
        }else{
            
        if (con.notPlaying1 === con.player1) {
            User.updateOne({ _id: con.users.player2 },
                {
                    $inc: {
                        'wallet.balance': con.totalAmount.toFixed(2),
                        "wallet.withdrawal": con.totalAmount.toFixed(2),
                        messageCount: 1,
                        'stats.profit': con.totalAmount.toFixed(2),
                        'stats.loss': -con.amount.toFixed(2)
                    }
                }).then(response => {


                    let order2 = {
                        "amount": con.totalAmount * 100,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 6,
                        "orderId": "Custom Duels Winner",
                        "notes": {
                            "userId": (con.users.player2).toString()
                        }
                    }

                    Orders.insertMany([
                        order2
                    ]).then(response => resolve(response))

                }).catch(err => reject(err))
        }

        if (con.notPlaying2 === con.player2) {
            User.updateOne({ _id: con.users.player1 },
                {
                    $inc: {
                        'wallet.balance': con.totalAmount.toFixed(2),
                        "wallet.withdrawal": con.totalAmount.toFixed(2),
                        messageCount: 1,
                        'stats.profit': con.totalAmount.toFixed(2),
                        'stats.loss': -con.amount.toFixed(2)
                    }
                }).then(response => {


                    let order2 = {
                        "amount": con.totalAmount * 100,
                        "status": "contest_credit",
                        "matchId": con.matchId,
                        "contestType": 6,
                        "orderId": "Custom Duels Winner",
                        "notes": {
                            "userId": (con.users.player1).toString()
                        }
                    }

                    Orders.insertMany([
                        order2
                    ]).then(response => resolve(response))

                }).catch(err => reject(err))
            }
        }


    }
    else {
        User.updateOne({
            _id: con.winner
        }, {
            $inc: {
                'wallet.balance': con.totalAmount.toFixed(2),
                "wallet.withdrawal": con.totalAmount.toFixed(2),
                messageCount: 1,
                'stats.profit': con.totalAmount.toFixed(2),
                'stats.loss': -con.amount.toFixed(2)
            }
        }).then(response => {
            let order = new Orders({
                "amount": con.totalAmount * 100,
                "status": "contest_credit",
                "matchId": con.matchId,
                "contestType": 6,
                "orderId": "Custom Duels Winner",
                "notes": {
                    "userId": (con.winner).toString()
                }
            })

            // let notf = new Notification({
            //     "amount": con.totalAmount,
            //     "matchId": con.matchId,
            //     title:"Congrats! You won against ₹" + con.totalAmount,
            //     "message": "You won ₹"+ payout*tax * con.totalAmount,
            //     "userId": (con.userId)
            // })

            // notf.save().then().catch()

            order.save().then(response => resolve(response)).catch(err => reject(err))
        })
    }

})

const leader = (contest) => new Promise((resolve, reject) => {


    let upd = [];
    let ll = [];
    let rnk = 1;

    FantasyJoinedUsers.aggregate([
        {
            $match: {
                "contestId": mongoose.mongo.ObjectID(contest._id)
            }
        },
        {
            $lookup: {
                from: "fantasyusersteams",
                localField: 'teamId',
                foreignField: '_id',
                as: 'teamDetails'
            }
        },
        {
            $lookup: {
                from: "users",
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $project: {
                teamDetails: { $arrayElemAt: ["$teamDetails", 0] },
                playerDetails: { $arrayElemAt: ["$teamDetails", 0] },
                userDetails: { $arrayElemAt: ["$userDetails", 0] },
            }
        },
        {
            $project: {
                teamDetails: {
                    teamName: 1,
                    _id: 1,
                    serialNumber: 1
                },
                userDetails: {
                    _id: 1,
                    userName: 1,
                    profilePic: 1
                },
                playerDetails: "$playerDetails.players",
            }
        },
        {
            $project: {
                teamDetails: 1,
                userDetails: 1,
                playerDetails: { $objectToArray: "$playerDetails" },
            }
        },
        {
            $project: {
                teamDetails: 1,
                userDetails: 1,
                points: { $sum: "$playerDetails.v.points" },
            },

        },
        {
            $group: {
                _id: "$points",

                users: {
                    $push: "$$ROOT"
                },
            }
        },
        {
            $sort: {
                "_id": -1
            }
        },
    ]).allowDiskUse(true).exec()
        .then(response => {
            if (response.length !== 0) {

                response.forEach((group, index) => {

                    let len = group.users.length > 1 ? group.users.length : 1

                    ll.push({ ...group, rank: rnk, "contestId": mongoose.mongo.ObjectID(contest._id), })

                    rnk = rnk + len;

                    upd.push(new Promise((resolve, reject) => FantasyLeaderBoard.updateOne({
                        "contestId": mongoose.mongo.ObjectID(contest._id)
                    }, {
                        $set: {
                            "contestId": mongoose.mongo.ObjectID(contest._id),
                            leader: ll
                        }
                    }, { upsert: true })
                        .then(response => resolve(response))
                        .catch(err => reject(err))))
                })


            } else {
                resolve([])
            }
        })

    Promise.all(upd).then(response => resolve(response)).catch(err => reject(err))
})

const dispatchFantasy = (contest) => new Promise((resolve, reject) => {
    let paidout = 0;
    let prize = contest.prize;

    



    const winDispatch = async () => {

        let leaderboard;

        await FantasyLeaderBoard.findOne({ contestId: mongoose.mongo.ObjectID(contest._id) })
            .lean()
            .then(response => {

                leaderboard = response !== null ? response.leader : []



            })

        for (const [index, leader] of leaderboard.entries()) {



            if (leader.users.length === 1) {

                await User.updateOne({
                    _id: mongoose.mongo.ObjectID(leader.users[0].userDetails._id)
                }, {
                    $inc: {
                        "wallet.balance": prize[paidout] > 10000 ? (prize[paidout] * 0.7).toFixed(2) : (prize[paidout]),
                        "wallet.withdrawal": prize[paidout] > 10000 ? (prize[paidout] * 0.7).toFixed(2) : (prize[paidout]),
                        messageCount: 1,
                        'stats.loss': -contest.entryFee
                    }
                }).then(response => response)

                let order = new Orders({
                    "amount": prize[paidout] > 10000 ? prize[paidout] * 100 * 0.7 : prize[paidout] * 100,
                    "status": "contest_credit",
                    "matchId": contest.matchId,
                    "contestType": 4,
                    "orderId": "Fantasy Contest: Rank #" + leader.rank,
                    "contestId": leader.contestId,
                    "notes": {
                        "userId": (leader.users[0].userDetails._id).toString()
                    }
                })

                await order.save().then(response => response)

                paidout += 1
            } else if (leader.users.length > 1) {
                let prize = contest.prize.slice(paidout, paidout + leader.users.length);

                let promiseAll = [];
                let orderAll = []
                prize = prize.reduce(reducer);

                prize = prize / leader.users.length;

                paidout += leader.users.length;



                for (const [index, users] of leader.users.entries()) {


                    promiseAll.push(new Promise((resolve, reject) => {
                        User.updateOne({
                            _id: mongoose.mongo.ObjectID(users.userDetails._id)
                        }, {
                            $inc: {
                                "wallet.balance": prize > 10000 ? (prize * 0.7).toFixed(2) : prize.toFixed(2),
                                "wallet.withdrawal": prize > 10000 ? (prize * 0.7).toFixed(2) : prize.toFixed(2),
                                messageCount: 1,
                                'stats.loss': -contest.entryFee
                            }
                        })
                            .then(response => resolve(true))
                            .catch(err => reject(err))
                    }))

                    orderAll.push(new Promise((resolve, reject) => {
                        let order = new Orders({
                            "amount": prize > 10000 ? prize * 100 * 0.7 : prize * 100,
                            "status": "contest_credit",
                            "matchId": contest.matchId,
                            "contestType": 4,
                            "orderId": "Fantasy Contest: Rank #" + leader.rank,
                            "contestId": leader.contestId,
                            "notes": {
                                "userId": (users.userDetails._id).toString()
                            }
                        })

                        order.save().then(response => resolve(true))
                            .catch(err => reject(err))
                    })
                    )

                }

                await Promise.all(promiseAll)
                await Promise.all(orderAll)


            }

        }




    }


    winDispatch().then(response => resolve(response)).catch(err => reject(err))

})


getMatch().then().catch(err => {
    
});


