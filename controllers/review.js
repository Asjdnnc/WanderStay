const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/wanderstay/listings/${id}`);
}

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log(req.session.username);
    req.flash("success","New Review created");
    res.redirect(`/wanderstay/listings/${listing._id}`);
    }