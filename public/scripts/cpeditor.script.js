const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: false,
});



const inputEditor = ace.edit("input-container");
inputEditor.setTheme("ace/theme/monokai");
inputEditor.session.setMode("ace/mode/txt");

const outputEditor = document.querySelector("#output-container");

const currentUser = outputEditor.dataset.currentUser;

const langSelect = document.querySelector("#lang");
const filename = document.querySelector(".file-name");

const saveBtn = document.querySelector("#save-code");
const codeName = document.querySelector("#code-name");
// saveBtn.style.backgroundColor = "red";

let projectTitle = null,projectCode = null,projectLang = null;

const projectData = document.querySelector("#invisible-container");
if(projectData.dataset.projectTitle){
  projectTitle = projectData.dataset.projectTitle;
  projectCode = projectData.dataset.projectCode;
  projectLang = langIcons[projectData.dataset.projectLang].name;
}

const setLanguage = (lang) => {
  editor.session.setMode(`ace/mode/${languages[lang].ace}`);
  currentLang = lang;
  filename.textContent = projectTitle || languages[lang].filename;
  sessionStorage.setItem("currLang", lang);
  langSelect.value = lang;
};

let currentLang = projectLang || sessionStorage.getItem("currLang") || "python";
setLanguage(currentLang);

if(projectCode){
  editor.setValue(projectCode); 
}
else if(sessionStorage.getItem("currCode")){
  editor.setValue(sessionStorage.getItem("currCode"), 1);
}
// const outputEdiitor = ace.edit('output-container');
// outputEdiitor.setTheme("ace/theme/monokai");
// outputEdiitor.session.setMode("ace/mode/txt");

const formatOutput = (output) => {
  let res = "";
  let n = output.length;

  let i = 0;
  while (i < n) {
    if (output[i] !== "\n") {
      res += output[i];
    } else {
      res += "<br/>";
    }
    i++;
  }
  return res;
};

langSelect.addEventListener("change", function () {
  // alert(this.value);
  setLanguage(this.value);
});

//session storage code

if (!sessionStorage.getItem("currCode")) {
  sessionStorage.setItem("currCode", "");
}

editor.getSession().addEventListener("change", () => {
  sessionStorage.setItem("currCode", editor.getSession().getValue());
});

const submitCode = async () => {
  const code = editor.getSession().getValue();
  const userinput = inputEditor.getSession().getValue();
  const language = languages[currentLang].code;
  const vIndex = languages[currentLang].vIndex;
  const data = {
    userCode: code,
    lang: language,
    versionIndex: vIndex,
    userInput: userinput,
  };

  const url = "http://localhost:80/cp/compile";
  await $.post(url, data, (d) => {
    // console.log(d,d.body.output);
    const formattedOutput = formatOutput(d.output);
    outputEditor.innerHTML = formattedOutput;
  });
};

const saveCode = async () => {
  const code = editor.getSession().getValue();
  const language = languages[currentLang].code;
  const vIndex = languages[currentLang].vIndex;
  let isAlreadySaved = false;
  // console.log(req.body);
  if(projectTitle){
    isAlreadySaved = true;
  }
  // console.log(code);
  const data = {
    userCode: code,
    lang: language,
    versionIndex: vIndex,
    title: projectTitle || codeName.value,
    isAlreadySaved:isAlreadySaved
  };
  const url = "http://localhost:80/cpeditor/save";
  
  await $.post(url, data,(res)=>{
    // console.log(res);
    if(!isAlreadySaved){
      const id = res[0]._id;
      const newURL = `http://localhost:80/cpeditor/${id}`;
      window.location.replace(newURL);
    }else{
      console.log(res);
    }
  });
};

// if (currentUser != "null") {
//   saveBtn.addEventListener("click", () => {
//     saveCode();
//   });
// }

// saveBtn.addEventListener("click", () => {
//   saveCode();
// });
