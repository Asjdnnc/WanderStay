const express = require("express");
const router = express.Router({ mergeParams: false });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const reservationController = require("../controllers/reservation.js");

// Check availability route
router.all("/check-availability", wrapAsync(reservationController.checkAvailability));

// Razorpay order creation route
router.post("/create-razorpay-order", isLoggedIn, wrapAsync(reservationController.createRazorpayOrder));

// Razorpay payment verification route
router.post("/verify-payment", isLoggedIn, wrapAsync(reservationController.verifyPayment));

// Legacy/Direct reservation create route
router.post("/createReservation", isLoggedIn, wrapAsync(reservationController.createReservation));

// Reservation show route
router.get("/showReservation", isLoggedIn, wrapAsync(reservationController.showReservation));

// Reservation delete route
router.delete("/destroyReservation/:id", isLoggedIn, wrapAsync(reservationController.destroyReservation));

module.exports = router;
    
