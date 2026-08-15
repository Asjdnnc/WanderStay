const User = require("../models/user");

const checkAdminStatus = (u) => {
    if (!u) return false;
    return (u.email === 'aditya05yt@gmail.com' || u._id.toString() === '667a2b1de114dd80462e0e54' || !!u.isAdmin);
};

// get current user status
module.exports.getCurrentUser = (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const isAdmin = checkAdminStatus(req.user);
        return res.json({ success: true, user: { _id: req.user._id, username: req.user.username, email: req.user.email, isAdmin } });
    }
    return res.json({ success: true, user: null });
};

// signup route
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const isAdmin = (email === 'aditya05yt@gmail.com');
        const newUser = new User({ email, username, isAdmin });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json({
                success: true,
                message: "Welcome to WanderStay!",
                user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email, isAdmin: checkAdminStatus(registeredUser) }
            });
        });
    } catch (e) {
        return res.status(400).json({ success: false, message: e.message });
    }
};

// login route
module.exports.login = async (req, res) => {
    const { username } = req.body;
    req.session.username = username;
    const isAdmin = checkAdminStatus(req.user);
    return res.json({
        success: true,
        message: "Welcome back to WanderStay!",
        user: { _id: req.user._id, username: req.user.username, email: req.user.email, isAdmin }
    });
};


// logout route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.json({ success: true, message: "Logged out successfully" });
    });
};