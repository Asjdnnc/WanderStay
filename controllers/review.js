const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    return res.json({ success: true, message: "Review deleted successfully" });
};

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    await newReview.populate("author", "username email");

    return res.status(201).json({
        success: true,
        message: "New review created!",
        review: newReview
    });
};