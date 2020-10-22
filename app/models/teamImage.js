 
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const TeamImage =  new Schema({
  teamId:Number,
  link:String
},{ strict: false,timestamps:true })

mongoose.model('TeamImage', TeamImage);