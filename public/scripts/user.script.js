
const projectIcons = document.querySelectorAll(".project-icon");

for (let i of projectIcons) {
  i.dataset.icon = langIcons[i.dataset.name].icon;
}

const projectSection = document.querySelector(".projects");
const projects = document.querySelectorAll(".project-container");
const userPage = document.querySelector(".user-page");
const userId = userPage.dataset.userid;
let cpProjects = [];
let webProjects = [];
let allProjects = [];
const input = document.querySelector("#search-input");
let deleteBtns;

const getProjectsFromServer = async (userid) => {
  const url = `http://localhost:8080/user/${userid}/projects`;
  const data = { id: userid };
  const projectData = await axios.post(url, data);
  //console.log(projectData);
  cpProjects = projectData.data.cpProjects;
  webProjects = projectData.data.webProjects;
};


const currentProjects = [...allProjects];

const clearAllProjects = () => {
  while(projectSection.childElementCount != 0){
    projectSection.removeChild(projectSection.children[0]);
  }
}

const deleteProject = async (project,elem) => {
  const id = project._id;
 
  projectSection.removeChild(elem);
  if(!project.html){
    const url = `http://localhost:8080/cpprojects/${id}`;
    await axios.delete(url);
  }else{
    const url = `http://localhost:8080/webprojects/${id}`;
    await axios.delete(url);
  }
}

const fillProjects = (userprojects) => {
  // console.log(userprojects);
  clearAllProjects();
  for(let project of userprojects){
    // console.log(project);
    const projectContainer = document.createElement("div");
    projectContainer.classList.add("project-container");

    const projectInfo = document.createElement("div");
    projectInfo.classList.add("project-info");

    const projectOptions = document.createElement("div");
    projectOptions.classList.add("project-options");

    const projectInfoIcon = document.createElement("span");
    projectInfoIcon.dataset.inline = "false";
    
    if(!project.html){
      projectInfoIcon.classList.add("iconify","project-icon");
      projectInfoIcon.dataset.icon = langIcons[project.language].icon;
    }else{
      projectInfoIcon.classList.add("iconify","project-icon-web");
      projectInfoIcon.dataset.icon = "foundation:web";
    }

    const projectTitle = document.createElement("div");
    projectTitle.classList.add("project-title");
    projectTitle.textContent = project.title;
    
    projectInfo.append(projectInfoIcon,projectTitle);

    // console.log(projectInfo);
    // console.log(projectContainer);
    const projectViewBtn = document.createElement("a");
    projectViewBtn.classList.add("view-project-btn");
    projectViewBtn.textContent = "VIEW";
    if(!project.html){
      projectViewBtn.setAttribute("href",`/cpeditor/${project._id}`);
    }else{
      projectViewBtn.setAttribute("href",`/webeditor/${project._id}`);
    }

    const projectDelBtn = document.createElement("div");
    projectDelBtn.classList.add("delete-project-btn");
    projectDelBtn.textContent = "DELETE";
    

    projectOptions.append(projectViewBtn,projectDelBtn);
    projectContainer.append(projectInfo,projectOptions);

    projectSection.append(projectContainer);
    projectDelBtn.addEventListener("click",()=>{
      deleteProject(project,projectContainer);
    })
    
  }

}








const initializeUserPage = async (uid) => {
  await getProjectsFromServer(uid);
  // console.log(webProjects);
  // console.log(cpProjects);
  allProjects = [...webProjects, ...cpProjects];

  fillProjects(allProjects);

  input.addEventListener("change",function(){
    const currentSet = allProjects.filter(proj => proj.title.includes(this.value))
    fillProjects(currentSet);
  })

  


}

initializeUserPage(userId);
