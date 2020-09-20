const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');
const User = mongoose.model('Users');



const getOrder = async (req,res) => {
    let count = await Orders.count({$or:[{"notes.userId":req.user.id},{"notes.userId":"all"}],status:{$ne:"created"}}).then(response => response)
    
    await User.updateOne({
        _id:mongoose.mongo.ObjectId(req.user.id)
    },{
        $set:{
            messageCount:0
        }
    }).exec()
    .then()

    await Orders.find({"notes.userId":req.user.id,status:{$ne:"created"}})
                                .sort({_id:-1})
                                .skip((parseInt(req.query.page) - 1)*50)
                                .limit(50)
                                .exec()
                                .then(response =>{res.status(200).json({data:response,page:Math.ceil(count/50)})})
}

module.exports = getOrder;