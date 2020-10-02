const mongoose = require('mongoose');
const Contest = mongoose.model('Contest');

const post = (req, res) => {

    try {
        
    
    console.log(req.body);
    let object
    if(req.body.contestType === '1'){
        object = {
            contestName: '1/3 Under/Over',
            contestType: 1,
            contestInfo: req.body.contestInfo,
            value1: req.body.value1,
            value2: req.body.value2,
            type: parseInt(req.body.type),
            status:"notstarted",
            featured: req.body.featured,
            typeName: req.body.type == '1' ? 'Runs' : req.body.type == '2' ? "Wickets" : "Points",
            matchId: parseInt(req.body.matchId),
            playerInfo: req.body.playerInfo,
        }
    }else if(req.body.contestType === '2'){
        object = {
            contestName: '1/2 Under/Over',
            contestType: parseInt(req.body.contestType),
            contestInfo: req.body.contestInfo,
            value: req.body.value,
            type: parseInt(req.body.type),
            status:"notstarted",
            featured: req.body.featured,
            typeName: req.body.type == '1' ? 'Runs' : req.body.type == '2' ? "Wickets" : "Points",
            matchId: parseInt(req.body.matchId),
            playerInfo: req.body.playerInfo,
        }
 
    }else{
        object = {
            contestName: "MatchUps",
            contestType: req.body.contestType,
            type: 3,
            status:"notstarted",
            team1: req.body.playerMatchUp1.team.id,
            team2: req.body.playerMatchUp2.team.id,
            player1:req.body.playerMatchUp1.id,
            player2:req.body.playerMatchUp2.id,
            handicap:req.body.playerMatchUp1.id,
            featured: req.body.featured,
            typeName: "Points",
            matchId: parseInt(req.body.matchId),
            players: {
                [req.body.playerMatchUp1.id]: req.body.playerMatchUp1,
                [req.body.playerMatchUp2.id]: req.body.playerMatchUp2
            }
        }
    }


    



   
 
   const _id = req.body._id !== '' && req.body._id !==   undefined  ?  req.body._id :  new mongoose.mongo.ObjectId;

 
    Contest.updateOne({_id:_id},object,{upsert:true}).then(resp => {
        res.status(200).json(resp);
    })
    } catch (error) {
        res.status(200).json(error);
    }
      
    /**
     * 
       Contestname: -More less-
       ContestType: 
       type: runs/wicket/Points
        PlayerId:
        Info: {
            redTeam: more
            blueTeam: less
        }
        RedTeam: [
            {
                userId:
                amount:
            }
        ]
        BlueTeam: []
        TotalAmount: {
            redTeam: 100,
            blueTeam: 1000
        },
        open: 
        // forAdmin
        FinalTotal: Red+blue
        profit: 
     */

}   


module.exports = post