const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.get("/current_user", userController.getCurrentUser);

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ success: false, message: info ? info.message : "Invalid username or password" });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            return userController.login(req, res);
        });
    })(req, res, next);
});

router.post("/logout", userController.logout);
router.get("/logout", userController.logout);

module.exports = router;