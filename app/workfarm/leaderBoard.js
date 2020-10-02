const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

let FantasyJoinedUsers = mongoose.model('FantasyJoinedUsers');
let FantasyLeaderBoard = mongoose.model('FantasyLeaderBoard');
let FantasyContest = mongoose.model('FantasyContest');

var mqtt = require('mqtt')
const chalk = require('chalk');

var MqttClientId = "MQTT_CLIENT_" + new Date().getTime();
/**
 * options:
 *  - clientId
 *  - username
 *  - password
 *  - keepalive: number
 *  - clean:
 *  - will: 
 */
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


module.exports = async (id) => {
    try {
        let fantasyContest = await FantasyContest.find({matchId:parseInt(id)})
                                                .lean()
                                                .then(response => response).catch(err => err)
        let arr = [] 
 
        console.log(chalk.bgRed("LeaderBoard match: "+ id));

        // fantasyContest.forEach(contest => {
        //     arr.push(new Promise((resolve,reject) => {
        //          FantasyJoinedUsers.aggregate([
        //             {
        //                 $match: {
        //                       "contestId": mongoose.mongo.ObjectID(contest._id)
        //                     }
        //             },
        //             {
        //                 $lookup:{
        //                     from:"fantasyusersteams",
        //                     localField: 'teamId',
        //                     foreignField: '_id',
        //                     as: 'teamDetails'
        //                 }
        //             },
        //             {
        //                 $lookup:{
        //                     from:"users",
        //                     localField: 'userId',
        //                     foreignField: '_id',
        //                     as: 'userDetails'
        //                 }
        //             },
        //             {
        //                 $project:{
        //                     teamDetails:{$arrayElemAt : ["$teamDetails",0]},
        //                     playerDetails:{$arrayElemAt : ["$teamDetails",0]},
        //                     userDetails:{$arrayElemAt : ["$userDetails",0]},
        //                 }
        //             },
        //             {
        //                 $project:{
        //                     teamDetails:{
        //                         teamName:1,
        //                         _id:1,
        //                         serialNumber:1
        //                     },
        //                     userDetails: {
        //                         _id:1,
        //                         userName:1,
        //                         profilePic:1
        //                     },
        //                     playerDetails: "$playerDetails.players",
        //                 }
        //             },
        //             {
        //                 $project:{
        //                     teamDetails:1,
        //                     userDetails:1,
        //                     playerDetails: {$objectToArray : "$playerDetails"},
        //                 }
        //             },
        //             {
        //                 $project:{
        //                     teamDetails:1,
        //                     userDetails:1,
        //                     points: { $sum: "$playerDetails.v.points" },
        //                 },
                        
        //             },
        //             {
        //                 $group:{
        //                     _id:"$points",
                            
        //                     users:{
        //                         $push:"$$ROOT"
        //                     },
        //                  }
        //             },
        //             {
        //                 $sort:{
        //                     "_id" : -1
        //                 }
        //             },
        //             ]).allowDiskUse(true).exec()
        //             .then(response => {
 
        //                 let rnk = 1;
        //                 let ll = [];
        //                 let upd = [];

        //                 if(response.length !== 0){
 
        //                     response.forEach((group,index) => {
                            
        //                         let len = group.users.length > 1 ? group.users.length : 1
                                
        //                         ll.push({...group,rank:rnk,"contestId": mongoose.mongo.ObjectID(contest._id),})
                        
        //                         rnk = rnk + len;
                        
        //                         upd.push(new Promise((resolve,reject) => FantasyLeaderBoard.updateOne({
        //                             "contestId": mongoose.mongo.ObjectID(contest._id)
        //                         },{
        //                            $set:{
        //                             "contestId": mongoose.mongo.ObjectID(contest._id),
        //                             leader:ll
        //                            }
        //                         },{upsert:true}).then(response => resolve(response)).catch(err => reject(err))))
        //                     })

        //                     publishLeader(contest._id)

        //                 }
                        
        //                 Promise.all(upd).then(response => resolve(response)).catch(err => reject(err))
    
        //             }).catch(err => reject(err))
        //     }))
        // })
        count=0
        for (const contest of fantasyContest) {
            count++
            await FantasyJoinedUsers.aggregate([
                {
                    $match: {
                          "contestId": mongoose.mongo.ObjectID(contest._id)
                        }
                },
                {
                    $lookup:{
                        from:"fantasyusersteams",
                        localField: 'teamId',
                        foreignField: '_id',
                        as: 'teamDetails'
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $project:{
                        teamDetails:{$arrayElemAt : ["$teamDetails",0]},
                        playerDetails:{$arrayElemAt : ["$teamDetails",0]},
                        userDetails:{$arrayElemAt : ["$userDetails",0]},
                    }
                },
                {
                    $project:{
                        teamDetails:{
                            teamName:1,
                            _id:1,
                            serialNumber:1
                        },
                        userDetails: {
                            _id:1,
                            userName:1,
                            profilePic:1
                        },
                        playerDetails: "$playerDetails.players",
                    }
                },
                {
                    $project:{
                        teamDetails:1,
                        userDetails:1,
                        playerDetails: {$objectToArray : "$playerDetails"},
                    }
                },
                {
                    $project:{
                        teamDetails:1,
                        userDetails:1,
                        points: { $sum: "$playerDetails.v.points" },
                    },
                    
                },
                {
                    $group:{
                        _id:"$points",
                        
                        users:{
                            $push:"$$ROOT"
                        },
                     }
                },
                {
                    $sort:{
                        "_id" : -1
                    }
                },
                ])
                .allowDiskUse(true)
                .exec()
                .then((response) => {

                    let rnk = 1;
                    let ll = [];
                    let upd = [];
 
                    if(response.length !== 0){

                        response.forEach((group,index) => {
                        
                            let len = group.users.length > 1 ? group.users.length : 1
                            
                            ll.push({...group,rank:rnk,"contestId": mongoose.mongo.ObjectID(contest._id),})
                    
                            rnk = rnk + len;
                    
                            upd.push(new Promise((resolve,reject) => FantasyLeaderBoard.updateOne({
                                "contestId": mongoose.mongo.ObjectID(contest._id)
                            },{
                               $set:{
                                "contestId": mongoose.mongo.ObjectID(contest._id),
                                leader:ll
                               }
                            },{upsert:true}).then(response => resolve(response)).catch(err => reject(err))))
                        })

                        publishLeader(contest._id)

                    }
                    
                    Promise.all(upd).then(response => {
                         
                    })

                })
        }
    
        // await Promise.all(arr).then(res =>  res)

        console.log(chalk.bgRed("LeaderBoard match Ended: "+ id));

    } catch (error) {
        console.log(error);
        return error
    }

 
}
function mqtt_publish(topic, message, options) {
        
    console.log(chalk.bgGrey("LeaderBoard mqtt_publish: "));

    client.publish(topic, message, { qos: (options.qos) ? options.qos : 0 },(err,res) => {
 
    })
}

 

const publishLeader = (id) => {

 
    FantasyLeaderBoard.aggregate([
        {
            $match:{
                contestId: mongoose.mongo.ObjectID(id),
            }
        },
        {
            $project:{
                leaderLength: {$size: "$leader"},
                leader: { $slice: [ "$leader", 0, 250 ] }
            }
        }
    ]).then(response => {
        mqtt_publish(id.toString(),JSON.stringify({
            leader:response ? response[0].leader : []
        }),{})

        
    })

    
}