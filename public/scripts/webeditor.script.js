// alert("ewfkjhwef");

const htmlEditor = ace.edit("html-editor");
htmlEditor.setTheme("ace/theme/monokai");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: false,
});
const htmlStartPlate = "<body>\n\n</body>"
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


const webFrame = document.querySelector('#web-output-frame');
const refreshBtn = document.querySelector('.refresh-btn');

const sendCode = async ()=>{
  const htmlCode = htmlEditor.getSession().getValue();
  const cssCode = cssEditor.getSession().getValue();
  const jsCode = jsEditor.getSession().getValue();

  const webData = {
    html:htmlCode,
    css:cssCode,
    js:jsCode
  }

  const url = "http://localhost:80/web/compile";
  await $.post(url, webData);
  setTimeout(()=>{
    webFrame.src = webFrame.src;
  },1000);
}

// htmlEditor.getSession().addEventListener("change", () => {
//   setTimeout(()=>{
//     sendCode();
//   },1000);
// });


refreshBtn.addEventListener('click',()=>{
  sendCode();
})


