const express = require("express");
const router = express.Router({ mergeParams: false });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const adminController = require("../controllers/admin");

// Helper to make currently logged in user an admin for easy testing/demo
router.post("/make-me-admin", isLoggedIn, wrapAsync(adminController.toggleMakeAdmin));

// Admin Stats Overview
router.get("/stats", isLoggedIn, isAdmin, wrapAsync(adminController.getStats));

// Manage Listings / Hostels
router.get("/listings", isLoggedIn, isAdmin, wrapAsync(adminController.getAllListings));
router.patch("/listings/:id/approve", isLoggedIn, isAdmin, wrapAsync(adminController.approveListing));
router.delete("/listings/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteListing));


// Manage Reviews / Comments
router.get("/reviews", isLoggedIn, isAdmin, wrapAsync(adminController.getAllReviews));
router.delete("/reviews/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteReview));

// Manage Bookings / Reservations
router.get("/bookings", isLoggedIn, isAdmin, wrapAsync(adminController.getAllBookings));
router.delete("/bookings/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteBooking));

module.exports = router;
