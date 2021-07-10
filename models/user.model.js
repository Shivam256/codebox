const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  projects:[{
    type:Schema.Types.ObjectId,
    ref:'Project'
  }],
  webProjects:[{
    type:Schema.Types.ObjectId,
    ref:'WebProject'
  }]
})

// UserSchema.virtual('projectCount').get(fucntion(){
//   return 
// })

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);

