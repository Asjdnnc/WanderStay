const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup)); //signup route

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, //login route
        //authenticate middleware
        passport.authenticate("local",{
            failureRedirect:"/wanderstay/login",
            failureFlash:true,
        }),
        wrapAsync(userController.login));

//logout route
router.get("/logout",userController.logout);



module.exports = router;