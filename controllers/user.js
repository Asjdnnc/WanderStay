const User = require("../models/user");
//signup form
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

//signup route
module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        //auto login after signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderStay!!");
            res.redirect("/wanderstay/listings");
        })
        }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/wanderstay/signup");
    }
    }

    //login form
    module.exports.renderLoginForm = (req,res)=>{
        res.render("users/login.ejs");
    }

    //login route
    module.exports.login = async(req,res)=>{
        const {username} = req.body;
        req.session.username = username;
         req.flash("success","Welcome back to WanderStay!!");
         let redirectUrl = res.locals.redirectUrl || "/wanderstay/listings"
         res.redirect(redirectUrl);
 }
    //logout
    module.exports.logout = (req,res,next)=>{
        req.logout((err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Logged out successfully");
            res.redirect("/wanderstay/listings");
        })
    }