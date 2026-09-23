/**
 * controllers/ai.js
 * ------------------------------------------------------------------
 * HTTP layer for the two AI features. Keeps AI logic in services/ and only
 * handles request validation, response shaping and safe error handling here.
 * Internal errors (API keys, stack traces, provider messages) are never
 * exposed to the client.
 */
const mongoose = require("mongoose");
const reviewSummaryService = require("../services/reviewSummaryService");
const ragService = require("../services/ragService");
const geminiService = require("../services/geminiService");

const MAX_QUERY_LENGTH = 500;

/** POST /api/ai/review-summary/:listingId */
module.exports.reviewSummary = async (req, res) => {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return res.status(400).json({ success: false, message: "Invalid listing id" });
    }
    if (!geminiService.isConfigured()) {
        return res.status(503).json({
            success: false,
            message: "AI review summaries are not available right now.",
        });
    }

    try {
        const force = req.query.force === "true";
        const summary = await reviewSummaryService.getReviewSummary(listingId, { force });
        return res.json({ success: true, summary });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        console.error("AI review summary error:", err.message);
        return res.status(502).json({
            success: false,
            message: "Could not generate the review summary. Please try again later.",
        });
    }
};

/** POST /api/ai/search  { query } */
module.exports.search = async (req, res) => {
    const { query } = req.body || {};

    if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ success: false, message: "Please enter a search query" });
    }
    if (query.trim().length > MAX_QUERY_LENGTH) {
        return res.status(400).json({
            success: false,
            message: `Query is too long (max ${MAX_QUERY_LENGTH} characters)`,
        });
    }
    if (!geminiService.isConfigured()) {
        return res.status(503).json({
            success: false,
            message: "AI search is not available right now.",
        });
    }

    try {
        const result = await ragService.search(query.trim());
        return res.json({ success: true, ...result });
    } catch (err) {
        console.error("AI search error:", err.message);
        return res.status(502).json({
            success: false,
            message: "AI search failed. Please try again later.",
        });
    }
};

/** POST /api/ai/index  (admin only) — re-index all listings into Qdrant. */
module.exports.indexListings = async (req, res) => {
    try {
        const result = await ragService.indexAllListings();
        return res.json({ success: true, ...result });
    } catch (err) {
        console.error("AI indexing error:", err.message);
        return res.status(502).json({
            success: false,
            message: "Indexing failed. Please try again later.",
        });
    }
};
