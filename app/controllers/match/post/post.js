const mongoose = require('mongoose');
const match = mongoose.model('Matches');
const TeamImage = mongoose.model('TeamImage');
// const redis = require('../../../library/redis/redis');
const moment = require('moment')
const post = async (req, res) => {
    console.log(req.body);

    let image1 = await TeamImage.findOne({
        teamId:req.body.localteam.id
    }).then(response => response ? response.link : req.body.localteam.image_path)

    let image2 = await TeamImage.findOne({
        teamId:req.body.visitorteam.id
    }).then(response => response ? response.link : req.body.visitorteam.image_path)

    req.body.localteam.image_path = image1
    req.body.visitorteam.image_path = image2
    
    await match.updateOne({id:req.body.id},{...req.body,isLive:false},{upsert:true}).then(response => {

        // redis.HMSET('cricket_'+req.body.id)
        // redis.EXPIREAT('cricket_'+req.body.id,moment.unix(req.body.starting_at));
        
        res.status(200).json(response);
    })
}   


module.exports = post