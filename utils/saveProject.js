const Project = require('../models/project.model');
const User = require('../models/user.model');

const saveProject = async (user,title,language,code) => {
  const project = new Project({
    title,
    language,
    code
  });
  project.author = user;
  await project.save();

  const user = await User.findById(user._id);
  user.projects.push(project);
  await user.save()
}

module.exports = saveProject;