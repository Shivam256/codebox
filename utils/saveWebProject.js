const WebProject = require('../models/webProject.model');
const User = require('../models/user.model');

const saveWebProject = async (title,html,css,js,user) => {
  const webProject = new WebProject({title,html,css,js});
  webProject.author = user;
  await webProject.save();

  const foundUser = await User.findById(user._id);
  foundUser.projects.push(webProject);
  await foundUser.save();
}

module.exports = saveWebProject;