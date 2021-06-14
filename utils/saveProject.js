const Project = require('../models/project.model');
const User = require('../models/user.model');

const saveProject = async (user,title,language,code,versionIndex) => {
  const project = new Project({
    title,
    language,
    code
  });
  project.author = user;
  project.versionIndex = versionIndex;
  await project.save();

  const foundUser = await User.findById(user._id);
  foundUser.projects.push(project);
  await foundUser.save()
}

module.exports = saveProject;