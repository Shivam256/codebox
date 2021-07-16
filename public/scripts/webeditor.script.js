// alert("ewfkjhwef");

const htmlEditor = ace.edit("html-editor");
htmlEditor.setTheme("ace/theme/monokai");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: false,
});
const htmlStartPlate = "<body>\n\n</body>";
htmlEditor.setValue(htmlStartPlate);

const cssEditor = ace.edit("css-editor");
cssEditor.setTheme("ace/theme/monokai");
cssEditor.session.setMode("ace/mode/css");
cssEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: false,
});

const jsEditor = ace.edit("js-editor");
jsEditor.setTheme("ace/theme/monokai");
jsEditor.session.setMode("ace/mode/javascript");
jsEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: false,
});

let projectHTML = null;
let projectCSS = null;
let projectJS = null;
let isAlreadySaved = false;
let savedProjectTitle = null;

const iC = document.querySelector(".invisible-web-container");
if (iC.dataset.projecthtml) {
  projectHTML = iC.dataset.projecthtml;
  projectCSS = iC.dataset.projectcss;
  projectJS = iC.dataset.projectjs;
  savedProjectTitle = iC.dataset.projecttitle;
  isAlreadySaved = true;
}

const initializeSessionStorage = (elem, key,) => {
  if(sessionStorage.getItem(key)) {
    elem.setValue(sessionStorage.getItem(key), 1);
  }
};
initializeSessionStorage(htmlEditor, "currentHTML");
initializeSessionStorage(cssEditor, "currentCSS");
initializeSessionStorage(jsEditor, "currentJS");

// if(projectHTML){
//   htmlEditor.setValue(projectHTML);
// }
const initializeSavedProject = (elem,code)=>{
  if(code){
    elem.setValue(code);
  }
}
initializeSavedProject(htmlEditor,projectHTML);
initializeSavedProject(cssEditor,projectCSS);
initializeSavedProject(jsEditor,projectJS);

const webFrame = document.querySelector("#web-output-frame");
const refreshBtn = document.querySelector(".refresh-btn");
const saveBtn = document.querySelector("#save-code");
const codeName = document.querySelector("#code-name");

const sendCode = async () => {
  const htmlCode = htmlEditor.getSession().getValue();
  const cssCode = cssEditor.getSession().getValue();
  const jsCode = jsEditor.getSession().getValue();

  const webData = {
    html: htmlCode,
    css: cssCode,
    js: jsCode,
  };

  const url = "http://localhost:8080/web/compile";
  await $.post(url, webData);
  setTimeout(() => {
    webFrame.src = webFrame.src;
  }, 1000);
};

refreshBtn.addEventListener("click", () => {
  sendCode();
});

const checkSessionStorage = (key) => {
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, "");
  }
};
checkSessionStorage("currentHTML");
checkSessionStorage("currentCSS");
checkSessionStorage("currentJS");

const enableSessionStorage = (key, elem) => {
  elem.getSession().addEventListener("change", () => {
    sessionStorage.setItem(key, elem.getSession().getValue());
  });
};

enableSessionStorage("currentHTML", htmlEditor);
enableSessionStorage("currentCSS", cssEditor);
enableSessionStorage("currentJS", jsEditor);

const saveWebCode = async () => {
  const data = {
    title: savedProjectTitle || codeName.value,
    html: htmlEditor.getSession().getValue(),
    css: cssEditor.getSession().getValue(),
    js: jsEditor.getSession().getValue(),
    isAlreadySaved:isAlreadySaved
  };
  // console.log("i get hitted!!");
  // console.log(data);

  const url = "http://localhost:8080/webeditor/save";
  await $.post(url, data,res=>{
    if(!isAlreadySaved){
      const id = res[0]._id;
      const newURL = `http://localhost:8080/webeditor/${id}`;
      window.location.replace(newURL);
    }else{
      console.log(res);
    }
  });
};
