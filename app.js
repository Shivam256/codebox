if (process.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const engine = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const axios = require("axios");
const cors = require('cors');

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.model");
const Project = require("./models/project.model");
const WebProject = require("./models/webProject.model");

const catchAsync = require("./utils/catchAsync");
const MyError = require("./utils/MyErrors");
const saveProject = require("./utils/saveProject");
const {createWebPage,blankWebPage} = require('./utils/createWebHtml');
const saveWebProject = require('./utils/saveWebProject');

const fs = require('fs');

const MongoDBStore = require('connect-mongo');

const dbUrl = process.env.DB_URL2 || 'mongodb://localhost:27017/codebox';
// const dbUrl = 'mongodb://localhost:27017/codebox';


const {isUserLoggedIn,isProjectAuthor,isWebProjectAuthor} = require('./middlewares');

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors())

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex:true
  })
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED TO DATABASE");
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION FAILED!!");
    console.log(err);
  });

const store = MongoDBStore.create({
  mongoUrl:dbUrl,
  secret:process.env.SESSION_SECRET,
  touchAfter:24*60*60
})

store.on("error",(e)=>{
  console.log("SESSION STORE ERROR",e);
})
//congiguring sessions
const sessionConfig = {
  store,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.isInProduction = (process.env.NODE_ENV == "production");
  // res.locals.testContent = "wkdjsnwkfevn kwejbhwe weifuh";
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/signin", (req, res) => {
  res.render("sign-in-and-sign-up", { message: req.flash("error") });
});

app.get("/cpeditor", (req, res) => {
  const project = null;
  res.render("cpeditor", { project });
});

app.get("/webeditor",(req,res)=>{
  const project = null;
  const blankPage = blankWebPage();
  try{
    const data = fs.writeFileSync('./public/html/demo.html',blankPage);
  }catch(err){
    console.log(err);
  }

  res.render("webeditor",{project});
})

app.post("/cp/compile", async (req, res) => {
  // console.log(req.body);
  const { userCode, lang, versionIndex, userInput } = req.body;
  const program = {
    script: userCode,
    language: lang,
    versionIndex: versionIndex,
    stdin: userInput,
    clientId: process.env.MY_CLIENT_ID,
    clientSecret: process.env.MY_CLIENT_SECRET,
  };

  const url_ = "https://api.jdoodle.com/v1/execute";
  const response = await axios.post(url_, program);
  const result = response.data;
  return res.send(result);
});

app.post('/web/compile',async (req,res)=>{
  // console.log("you hit me!!");
  // console.log(req.body);
  
  const webPage = createWebPage(req.body);
  // console.log(webPage);
  try{
    const data = fs.writeFileSync('./public/html/demo.html',webPage);
  }catch(err){
    console.log(err);
  }
  res.send("wekjnwe");
})

app.post(
  "/signup",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;
      // console.log(req.body);

      if (password != confirmPassword) {
        req.flash("error", "Your passwords did not match");
        return res.redirect("/signin");
      }
      const user = new User({
        username,
        email,
      });
      const registeredUser = await User.register(user, password);
      await user.save();

      req.login(registeredUser, (err) => {
        if (err) {
          console.log(err);
        }
        // console.log(req.user);
        return res.redirect("/");
      });
    } catch (err) {
      console.log("error in registering");
      console.log(err);
    }
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/signin",
  }),
  catchAsync(async (req, res) => {
    // console.log(req);
    res.redirect("/");
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post(
  "/cpeditor/save",
  catchAsync(async (req, res) => {
    // console.log('I GOT FIREDDDDDD');
    // console.log(req.body);
    const { userCode, lang, versionIndex, title ,isAlreadySaved} = req.body;
    const user = req.user;
    if(isAlreadySaved == 'true'){
      await Project.findOneAndUpdate({title:title},{code:userCode})
      return res.send('yay');
    }
    await saveProject(user, title, lang, userCode, versionIndex);

    const project = await Project.find({title});
    const idx = project._id;
    // res.render('cpeditor',{project});
    res.send(project);
  })
);

app.post('/webeditor/save',catchAsync(async (req,res)=>{
  // console.log("you hit me!!!");
  // console.log(req.body);
  const {html,css,js,title,isAlreadySaved} = req.body;
  const user = req.user;
  if(isAlreadySaved == 'true'){
    await WebProject.findOneAndUpdate({title:title},{html:html,css:css,js:js});
    return res.send('updated');
  }else{
    await saveWebProject(title,html,css,js,user);
  }
  const webProject = await WebProject.find({title});
  res.send(webProject);
}))

//user routes
app.get(
  "/user/:id",isUserLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("projects").populate("webProjects");
    // console.log(user.projects);
    // console.log(user);
    res.render("user", { user });
  })
);

app.get(
  "/cpeditor/:projectId",isUserLoggedIn,isProjectAuthor,
  catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    res.render("cpeditor", { project });
  })
);

app.get("/webeditor/:projectId",isUserLoggedIn,isWebProjectAuthor,catchAsync(async (req,res)=>{
  const {projectId} = req.params;
  const project = await WebProject.findById(projectId);
  res.render("webeditor",{project});
}))

app.post("/user/:userId/projects",catchAsync(async (req,res)=>{
  // console.log(req.body);
  const {userId} = req.params;
  const user = await User.findById(userId).populate("projects").populate("webProjects");
  const projects = user.projects;
  const webProjects = user.webProjects;
  const data = {
    cpProjects:projects,
    webProjects:webProjects
  }
  res.send(data);
}))


app.delete('/cpprojects/:projectId',isUserLoggedIn,catchAsync(async (req,res)=>{
  // console.log("i got hit cp");
  const {projectId} = req.params;
  await Project.findByIdAndDelete(projectId);

  const user = await User.findById(req.user._id);
  user.projects = user.projects.filter((proj)=>(!proj._id.equals(projectId)));
  await user.save();
  
}))
app.delete('/webprojects/:projectId',isUserLoggedIn,catchAsync(async (req,res)=>{
  // console.log("i got hit web");
  const {projectId} = req.params;
  await WebProject.findByIdAndDelete(projectId);

  const user = await User.findById(req.user._id);
  user.webProjects = user.webProjects.filter(proj => (!proj._id.equals(projectId)));
  await user.save();
}))



app.all("*", (req, res, next) => {
  next(new MyError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "SOMETHING WENT WRONG!!!!";
  }

  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Server statted on port ${PORT}`);
  console.log(`https://localhost:${PORT}`);
});
