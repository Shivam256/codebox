// const User = require("./models/user.model");
const Project = require("./models/project.model");
// const catchAsync = require("./utils/catchAsync");

module.exports.isUserLoggedIn = (req,res,next)=>{
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash('error','You must me logged in!');
    res.redirect('/signin');
  }
}

module.exports.isProjectAuthor = async (req,res,next)=>{
  const {projectId} = req.params;
  const project = await Project.findById(projectId);
  // console.log(project);
  // next();

  if(!project.author.equals(req.user._id)){
    return res.redirect('/');
  }else{
    next();
  }
}


