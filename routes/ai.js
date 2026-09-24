const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const aiController = require("../controllers/ai.js");

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window`
    message: { success: false, message: "Too many AI requests from this IP, please try again after 15 minutes." }
});

// Apply rate limiting to all AI routes
router.use(aiLimiter);

// AI-powered structured review summary for a listing (public, cached).
router.post("/review-summary/:listingId", wrapAsync(aiController.reviewSummary));

// RAG-based natural-language property search (public).
router.post("/search", wrapAsync(aiController.search));

// Re-index all listings into Qdrant (admin only).
router.post("/index", isLoggedIn, isAdmin, wrapAsync(aiController.indexListings));

module.exports = router;
