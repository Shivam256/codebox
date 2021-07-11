// alert("iefwe");

// const { default: axios } = require("axios");

const projectIcons = document.querySelectorAll('.project-icon');
// const lng = projectIcon.dataset.name;

for(let i of projectIcons){
  i.dataset.icon = langIcons[i.dataset.name].icon;
}
// const projects = document.querySelectorAll(".project-container");
const userPage = document.querySelector(".user-page");
const userId = userPage.dataset.userid;
let cpProjects = [];
let webProjects = [];
// let projects = [];
const input = document.querySelector("#search-input");

const getProjectsFromServer = async (userid) => {
  const url = `http://localhost:80/user/${userid}/projects`;
  const data = {id:userid};
  const projectData = await axios.post(url,data);
  //console.log(projectData);
  cpProjects = projectData.data.cpProjects;
  webProjects = projectData.data.webProjects;
}
getProjectsFromServer(userId);

let allProjects = cpProjects.concat(webProjects);






