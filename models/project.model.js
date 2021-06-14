const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  language:String,
  versionIndex:Number,
  author:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  code:{
    type:String
  }
})


module.exports = mongoose.model('Project',ProjectSchema);