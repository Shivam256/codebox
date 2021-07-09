const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebProjectSchema = new Schema({
  title:{
    type:String,
    required:true,
  },
  html:String,
  css:String,
  js:String,
  author:{
    type:Schema.Types.ObjectId,
    ref:'user'
  }
})

module.exports = mongoose.model('WebProject',WebProjectSchema);