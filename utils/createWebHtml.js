const createWebPage = (data) => {
  const htmlCode = data.html;
  const cssCode = data.css;
  const jsCode = data.js;

  const webPage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <style>
  ${cssCode}
  </style>
  ${htmlCode}
  <script>
  ${jsCode}
  </script>
  </html>
  `;

  return webPage;
};

const blankWebPage = () => {
  const webPage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <style>
  </style>
  <script>
  </script>
  </html>
  `;

  return webPage;
}

module.exports = {createWebPage,blankWebPage}

// module.exports = createWebPage;

