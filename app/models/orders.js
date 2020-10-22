 
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Orders =  new Schema({},{ strict: false,timestamps:true })

mongoose.model('Orders', Orders);