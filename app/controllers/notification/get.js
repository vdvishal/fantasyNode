const mongoose = require('mongoose')
const Notification = mongoose.model('Notification')
const Users = mongoose.model('Users')

const get = async (req,res) => {
    try {

        await Users.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
            $set:{
                unreadNotification:0
            }
        }).then(response => response)
    
        await Notification.find({userId:mongoose.mongo.ObjectID(req.user.id)})
        .sort({_id:-1})
        .limit(100)
        .then(response => {
            res.status(200).json({
                data:response
            })
        })
    } catch (error) {
        console.log(error);
        res.status(502).json({
            message:"Internal server error"
        })
    }
 



}

module.exports = get;