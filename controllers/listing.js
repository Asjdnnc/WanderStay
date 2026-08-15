const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN || "pk.eyJ1IjoiZGVtbyIsImEiOiJjbGV2M3B4ZXcwMDJpM3BwNmNpMnRxdXN4In0.fake";
let geocodingClient;
try {
    if (mapToken) {
        geocodingClient = mbxGeocoding({ accessToken: mapToken });
    }
} catch (e) {
    console.error("Mapbox token initialization error:", e.message);
}

// index
module.exports.index = async (req, res) => {
    // Only return approved listings for public catalog
    const allListings = await Listing.find({ isApproved: { $ne: false } }).sort({ _id: -1 });
    res.json({ success: true, listings: allListings });
};

// show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", select: "username email" } })
        .populate("owner", "username email");
    if (!data) {
        return res.status(404).json({ success: false, message: "Listing does not exist" });
    }
    data.clickCount += 1;
    await data.save();
    res.json({ success: true, listing: data });
};

// create route
module.exports.createListing = async (req, res, next) => {
    let listingData = req.body.listing;
    if (typeof listingData === "string") {
        listingData = JSON.parse(listingData);
    }
    let geometry = { type: "Point", coordinates: [77.2090, 28.6139] }; // Default coordinates
    if (geocodingClient && listingData.location) {
        try {
            let response = await geocodingClient.forwardGeocode({
                query: listingData.location,
                limit: 1,
            }).send();
            if (response.body.features && response.body.features.length > 0) {
                geometry = response.body.features[0].geometry;
            }
        } catch (err) {
            console.error("Geocoding failed:", err.message);
        }
    }

    let image = {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        filename: "listingimage"
    };
    if (req.file) {
        image = { url: req.file.path, filename: req.file.filename };
    }

    let categories = listingData.categories || [];
    if (!Array.isArray(categories)) {
        categories = [categories];
    }

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = image;
    newListing.geometry = geometry;
    newListing.categories = categories;
    newListing.isApproved = false; // Requires Admin Approval

    let saved = await newListing.save();
    res.status(201).json({
        success: true,
        message: "Your stay has been submitted for approval! It will be published once reviewed by an admin.",
        listing: saved
    });
};

// update/edit route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listingData = req.body.listing;
    if (typeof listingData === "string") {
        listingData = JSON.parse(listingData);
    }

    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    Object.assign(listing, listingData);

    if (geocodingClient && listingData.location) {
        try {
            let response = await geocodingClient.forwardGeocode({
                query: listingData.location,
                limit: 1,
            }).send();
            if (response.body.features && response.body.features.length > 0) {
                listing.geometry = response.body.features[0].geometry;
            }
        } catch (err) {
            console.error("Geocoding edit failed:", err.message);
        }
    }

    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();
    res.json({ success: true, message: "Listing updated successfully", listing });
};

// search route
module.exports.search = async (req, res) => {
    const { query } = req.query.query ? req.query : req.body;
    if (query && query.trim()) {
        const regex = new RegExp(query.trim(), 'i');
        const searchQuery = {
            isApproved: { $ne: false },
            $or: [{ country: regex }, { title: regex }, { location: regex }],
        };
        const results = await Listing.find(searchQuery);
        return res.json({ success: true, results });
    }
    const results = await Listing.find({ isApproved: { $ne: false } });
    res.json({ success: true, results });
};

// filter feature
module.exports.category = async (req, res) => {
    const { category } = req.query;
    let listings;
    if (category === "Trending") {
        listings = await Listing.aggregate([
            { $match: { isApproved: { $ne: false } } },
            { $sort: { clickCount: -1 } },
            { $limit: 10 }
        ]);
    } else if (category && category !== "All") {
        listings = await Listing.find({ isApproved: { $ne: false }, categories: category });
    } else {
        listings = await Listing.find({ isApproved: { $ne: false } });
    }
    res.json({ success: true, listings, category });
};


// delete route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ success: true, message: "Listing deleted successfully" });
};

