const Listing = require("../models/listing");
const Review = require("../models/review");
const Reservation = require("../models/reservation");
const User = require("../models/user");

// Dashboard Overview Statistics
module.exports.getStats = async (req, res) => {
    const totalListings = await Listing.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalUsers = await User.countDocuments();

    const reservations = await Reservation.find();
    const totalRevenue = reservations.reduce((acc, r) => acc + (r.price || 0), 0);

    const recentBookings = await Reservation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("listing")
        .populate("author", "username email");

    return res.json({
        success: true,
        stats: {
            totalListings,
            totalReviews,
            totalReservations,
            totalUsers,
            totalRevenue
        },
        recentBookings
    });
};

// Manage Hostels / Listings
module.exports.getAllListings = async (req, res) => {
    const listings = await Listing.find().populate("owner", "username email");
    return res.json({ success: true, listings });
};

module.exports.approveListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    listing.isApproved = true;
    await listing.save();
    return res.json({ success: true, message: "Hostel approved and published live on WanderStay!", listing });
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }
    
    // Delete associated reviews
    if (listing.reviews && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    
    await Listing.findByIdAndDelete(id);
    return res.json({ success: true, message: "Listing & associated reviews deleted successfully" });
};


// Manage Comments & Reviews
module.exports.getAllReviews = async (req, res) => {
    // Fetch all listings that have reviews populated
    const listings = await Listing.find({})
        .select("title reviews")
        .populate({
            path: "reviews",
            populate: { path: "author", select: "username email" }
        });

    const reviews = [];
    listings.forEach(listing => {
        if (listing.reviews && listing.reviews.length > 0) {
            listing.reviews.forEach(review => {
                if (review && review._id) {
                    reviews.push({
                        ...review.toObject(),
                        listing: {
                            _id: listing._id,
                            title: listing.title
                        }
                    });
                }
            });
        }
    });

    // Handle any orphaned reviews
    const allReviewDocs = await Review.find().populate("author", "username email");
    const mappedReviewIds = new Set(reviews.map(r => r._id.toString()));
    
    allReviewDocs.forEach(rev => {
        if (!mappedReviewIds.has(rev._id.toString())) {
            reviews.push({
                ...rev.toObject(),
                listing: null
            });
        }
    });

    return res.json({ success: true, reviews });
};


module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    await Listing.updateMany({ reviews: id }, { $pull: { reviews: id } });
    await Review.findByIdAndDelete(id);
    return res.json({ success: true, message: "Review deleted successfully" });
};

// Manage Bookings & Reservations
module.exports.getAllBookings = async (req, res) => {
    const bookings = await Reservation.find()
        .sort({ createdAt: -1 })
        .populate("listing", "title location country image price")
        .populate("author", "username email");
    return res.json({ success: true, bookings });
};

module.exports.deleteBooking = async (req, res) => {
    const { id } = req.params;
    await User.updateMany({ Reservations: id }, { $pull: { Reservations: id } });
    await Reservation.findByIdAndDelete(id);
    return res.json({ success: true, message: "Booking cancelled & removed successfully" });
};

// Admin Status Toggle / Grant for User
module.exports.toggleMakeAdmin = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isAdmin = true;
    await user.save();
    return res.json({ success: true, message: "User granted Admin privileges!", user });
};
