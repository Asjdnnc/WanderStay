const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const aiController = require("../controllers/ai.js");

// AI-powered structured review summary for a listing (public, cached).
router.post("/review-summary/:listingId", wrapAsync(aiController.reviewSummary));

// RAG-based natural-language property search (public).
router.post("/search", wrapAsync(aiController.search));

// Re-index all listings into Qdrant (admin only).
router.post("/index", isLoggedIn, isAdmin, wrapAsync(aiController.indexListings));

module.exports = router;
