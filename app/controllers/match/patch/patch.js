const mongoose = require('mongoose');
const match = mongoose.model('Matches');
const FantasyPlayer = mongoose.model('FantasyPlayer');
const TeamImage = mongoose.model('TeamImage');

module.exports = async (req,res) => {
    // redis.flushall();
    try {
        
        console.log('req.body: ', req.body);
    switch (req.body.type) {
        
        case 2:
            let matchDetail = await match.findOne({
                id:parseInt(req.body.matchId)
            }).lean().then(response => response);

           await TeamImage.updateOne({teamId:req.body.teamId},{
                $set:{
                    teamId:req.body.teamId,
                    link:req.body.link
                }
            },{
                upsert:true
            }).then(response => response)

            if(matchDetail.localteam.id === req.body.teamId){
                matchDetail.localteam.image_path = req.body.link
            }
            
            if(matchDetail.visitorteam.id === req.body.teamId){
                matchDetail.visitorteam.image_path = req.body.link
            }

            await match.updateOne({
                id:parseInt(req.body.matchId)
            },{
                $set:{
                    localteam:matchDetail.localteam,
                    visitorteam:matchDetail.visitorteam,
                }
            }).then(response => {})
 
            let fanPlayer = await FantasyPlayer.findOne({
                matchId:parseInt(req.body.matchId)
            }).lean().then(response => response)
            console.log('players: ', fanPlayer);
            console.log('players: ', req.body.teamId);

            let players = fanPlayer.players[req.body.teamId.toString()]
            console.log('players: ', players);

            Object.entries(players).forEach(([key, value]) => {
                fanPlayer.players[req.body.teamId.toString()][key].teamDetails.image_path = req.body.link
            })

            await FantasyPlayer.updateOne({
                matchId:parseInt(req.body.matchId) 
            },{
                $set:{
                    ...fanPlayer
                }
            }).then(response => response)

            res.send({message:"Image updated"})
            break;
    
        default:
            match.update({
                id:parseInt(req.body.matchId)
            },{
                $set:{
                    isOnsite:true
                }
            }).then(response => res.send({message:"match live"}))
            break;
    }

    } catch (error) {
        console.log('error: ', error);
            
    }
    
} 