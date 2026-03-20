//requiring library 
if(!process.env.NODE_ENV != "production"){ //to protect the credientials of env
require('dotenv').config();
} 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const mongodb = "mongodb://127.0.0.1:27017/project";
// const dbUrl = process.env.ATLASDB_URL;
const dbUrl = process.env.NODE_ENV === "production" ? process.env.ATLASDB_URL : mongodb;
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate'); 
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const reservationRouter = require("./routes/reservation.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user.js"); 

//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); //to decode the put request
app.use(methodOverride("_method")); //for modified request
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
 
const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*3600, //time for session update if not change
});
store.on("error",()=>{
    console.log("error in mongo session store",err)
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, //one week
        maxAge: 7*24*60*60*1000,
        httpOnly:true //security 
    }
};

app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); 

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://majorproject-0elt.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    try {
      let user = await User.findOne({ googleId: id });
      if (!user) {
        // If no user with this Google ID, check if the email exists
        user = await User.findOne({ email: emails[0].value });
        if (user) {
          // If email exists, link Google ID to this user
          user.googleId = id;
          user.username = displayName;  // Update username if necessary
        } else {
          // If no user with this email, create a new user
          user = await User.create({
            googleId: id,
            email: emails[0].value,
            username: displayName,
          });
        }
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
  // Google Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication
      req.flash("success", "Welcome!");
      res.redirect('/wanderstay/listings');  // Redirect to your dashboard or home page
    }
  );
  

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

main() //main function to connect with mongoDB
.then(() => {
    console.log("connection successfull");
})
.catch((err) => {
    console.log(err);
});
async function main() { 
    await mongoose.connect(dbUrl);
}

app.use("/wanderstay/listings",listingsRouter);
app.use("/wanderstay/listings/:id/reviews",reviewsRouter);
app.use("/wanderstay",userRouter,reservationRouter);

app.all("*",(req,res,next)=>{  //if route do not match 
    next(new ExpressError(404,"Page not found"));
 });
 
app.use((err,req,res,next)=>{
    let {status=500,message="Something wrong"} = err;
    res.render("listings/error.ejs",{message});
});

app.listen(port,() => {   //listing the request
    console.log("server started");
});
