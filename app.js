if (process.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = 8080;
const engine = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const request = require('request');


const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.model");
const catchAsync = require("./utils/catchAsync");

const MyError = require('./utils/MyErrors');


app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/codebox", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED TO DATABASE");
  })
  .catch((err) => {
    console.log("DATABASE CONNECTION FAILED!!");
    console.log(err);
  });

//congiguring sessions
const sessionConfig = {
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
  // res.locals.testContent = "wkdjsnwkfevn kwejbhwe weifuh";
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/signin", (req, res) => {
  res.render("sign-in-and-sign-up", { message: req.flash("error") });
});

app.get('/cpeditor',(req,res)=>{
  res.render('cpeditor')
})


app.post('/compile',async (req,res)=>{
  console.log(req.body);
  const {userCode,lang,versionIndex,userInput} = req.body;
  const program = {
    script : userCode,
    language: lang,
    versionIndex: versionIndex,
    stdin:userInput,
    clientId: process.env.MY_CLIENT_ID,
    clientSecret:process.env.MY_CLIENT_SECRET
  }

  request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
  },
  function (error, response, body) {
    const result = {
      body:body,
      stautusCode : response && response.statusCode,
      error:error
    }
    console.log(result);
    return  res.send(result);
  });
  
  
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
    console.log(req);
    res.redirect("/");
  })
);

app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
})


app.post('/cpeditor/save',(req,res)=>{
  console.log('I GOT FIREDDDDDD');
  console.log(req.body);
  res.send('yay');
})






app.all('*', (req, res, next) => {
  next(new MyError('Page Not Found!', 404));
})

app.use((err,req,res,next)=>{
  const {statusCode = 500} = err;
  if(!err.message){
    err.message = 'SOMETHING WENT WRONG!!!!';
  }

  res.status(statusCode).render('error',{err})
})



app.listen(PORT, () => {
  console.log(`Server statted on port ${PORT}`);
  console.log(`https://localhost:${PORT}`);
});
