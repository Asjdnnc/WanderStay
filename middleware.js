const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// middleware to check user login in website
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Please login to perform this action" });
    }
    next();
};

// middleware to save redirect url before login process
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        return res.status(403).json({ success: false, message: "You do not have permission to modify this listing" });
    }
    next();
};

// server-side validation
module.exports.validateListing = (req, res, next) => {
    // If request body contains parsed JSON listing string or object
    let bodyToValidate = req.body;
    if (typeof req.body.listing === "string") {
        try {
            bodyToValidate = { listing: JSON.parse(req.body.listing) };
            req.body.listing = bodyToValidate.listing;
        } catch (e) {}
    }
    let { error } = listingSchema.validate(bodyToValidate);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        return res.status(400).json({ success: false, message: errMsg });
    } else {
        next();
    }
};

// middleware for validating reviews
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        return res.status(400).json({ success: false, message: errMsg });
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (!res.locals.currUser || (!review.author.equals(res.locals.currUser._id) && !res.locals.currUser.isAdmin)) {
        return res.status(403).json({ success: false, message: "You do not have permission to delete this review" });
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Please login to access the admin portal" });
    }
    const isTargetAdmin = (req.user.email === 'aditya05yt@gmail.com' || req.user._id.toString() === '667a2b1de114dd80462e0e54' || !!req.user.isAdmin);
    if (!isTargetAdmin) {
        return res.status(403).json({ success: false, message: "Access denied. Only aditya05yt@gmail.com has admin access." });
    }
    next();
};



