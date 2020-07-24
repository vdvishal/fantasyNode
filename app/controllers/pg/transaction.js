const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');
const User = mongoose.model('Users');



const getOrder = (req,res) => {
    Orders.find({"notes.userId":req.user.id,status:{$ne:"created"}})
                                .sort({_id:-1})
                                .skip(req.query.page*50)
                                .limit(50)
                                .exec()
                                .then(response =>{res.status(200).json(response)})
}

module.exports = getOrder;