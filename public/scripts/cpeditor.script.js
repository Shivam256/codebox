const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: false,
});



if (sessionStorage.getItem("currCode")) {
  editor.setValue(sessionStorage.getItem("currCode"), 1);
}

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

const setLanguage = (lang) => {
  editor.session.setMode(`ace/mode/${languages[lang].ace}`);
  currentLang = lang;
  filename.textContent = languages[lang].filename;
  sessionStorage.setItem("currLang", lang);
  langSelect.value = lang;
};

let currentLang = sessionStorage.getItem("currLang") || "python";
setLanguage(currentLang);

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

  const url = "http://localhost:80/compile";
  await $.post(url, data, (d) => {
    // console.log(d,d.body.output);
    const formattedOutput = formatOutput(d.output);
    outputEditor.innerHTML = formattedOutput;
  });
};



const saveCode = () => {
  // alert("hewefn");
  // console.log('i got clicekd')
  const code = editor.getSession().getValue();
  const language = languages[currentLang].code;
  const vIndex = languages[currentLang].vIndex;
  const data = {
    userCode: code,
    lang: language,
    versionIndex: vIndex,
    title:codeName.value
  };
  const url = "http://localhost:80/cpeditor/save";
  $.post(url, data);
};

// if (currentUser != "null") {
//   saveBtn.addEventListener("click", () => {
//     saveCode();
//   });
// }

// saveBtn.addEventListener("click", () => {
//   saveCode();
// });
