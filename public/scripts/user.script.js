// alert("iefwe");

const projectIcons = document.querySelectorAll('.project-icon');
// const lng = projectIcon.dataset.name;

for(let i of projectIcons){
  i.dataset.icon = langIcons[i.dataset.name]
}
