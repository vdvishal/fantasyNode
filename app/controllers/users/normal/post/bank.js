const
    mongoose = require('mongoose'),
    User = mongoose.model('Users');
const Joi = require('joi')

const schema = Joi.object({
    bankName:Joi.string().required(),
    accNumber: Joi.any().required(),
    IFSC: Joi.any().required(),
    image:Joi.string().required(),
})

    const bank = async (req, res) => {
        try {
            
            
        const value = await schema.validateAsync(req.body) 
        console.log(value);

        let object = {
            bankName: req.body.bankName,
            accNumber: req.body.accNumber,
            IFSC: req.body.IFSC,
            image:req.body.image
        }

        await User.updateOne({_id:mongoose.mongo.ObjectID(req.user.id)},{
            $set:{
                bank: object
            }
        }).then(response => res.status(200).json({message:"Bank updated, waiting to be verified"}))
         


        } catch (error) {
 
            if(error.code){
                res.status(500).json({message:"Error try again later"})
            }else{
                console.log(error);
                
                return res.status(400).json({message:error})
            }
            
        }
    }


module.exports = bank
