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
const langSelect = document.querySelector("#lang");
const filename = document.querySelector(".file-name");
const saveBtn = document.querySelector("#save-code");

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

  const url = "http://localhost:8080/compile";
  await $.post(url, data, (d) => {
    // console.log(d,d.body.output);
    const formattedOutput = formatOutput(d.body.output);
    outputEditor.innerHTML = formattedOutput;
  });
};

const saveCode = async () => {
  const code = editor.getSession().getValue();
  const language = languages[currentLang].code;
  const vIndex = languages[currentLang].vIndex;
  const data = {
    userCode: code,
    lang: language,
    versionIndex: vIndex,
  };
  const url = "http://localhost:8080/cpeditor/save";
  await $.post(url, data);
};

saveBtn.addEventListener("click", () => {
  saveCode();
});
