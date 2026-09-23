/**
 * reviewSummaryService.js
 * ------------------------------------------------------------------
 * Generates a structured AI summary of a listing's MongoDB reviews using
 * Gemini. To avoid calling Gemini repeatedly for unchanged reviews, the
 * generated summary is cached on the Listing document together with a hash of
 * the review contents; a new summary is only generated when that hash changes.
 */
const crypto = require("crypto");
const Listing = require("../models/listing");
const { generateStructured } = require("./geminiService");

const MIN_REVIEWS = 1;

const SYSTEM_INSTRUCTION = `You are a travel and property review assistant for Wanderstay.

You may ONLY summarize the guest reviews supplied to you. Do not invent, assume, or add any information that is not present in the reviews.

Clearly distinguish positive feedback from negative feedback. Base positivePoints and negativePoints strictly on what guests actually wrote.

Keep the overall summary concise, balanced and factual. If the reviews are too few or lack substance to form a reliable summary, set insufficient to true and say so in the summary field.`;

const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        summary: { type: "string" },
        positivePoints: { type: "array", items: { type: "string" } },
        negativePoints: { type: "array", items: { type: "string" } },
        insufficient: { type: "boolean" },
    },
    required: ["summary", "positivePoints", "negativePoints", "insufficient"],
};

/** Stable hash of the review contents used for cache invalidation. */
function hashReviews(reviews) {
    const basis = reviews
        .map((r) => `${r.rating || ""}:${r.comment || ""}`)
        .join("|");
    return crypto.createHash("sha256").update(basis).digest("hex");
}

/**
 * Get (or generate) the AI review summary for a listing.
 * @param {string} listingId
 * @param {Object} [opts]
 * @param {boolean} [opts.force] - bypass the cache and regenerate.
 */
async function getReviewSummary(listingId, { force = false } = {}) {
    const listing = await Listing.findById(listingId).populate(
        "reviews",
        "rating comment"
    );
    if (!listing) {
        const err = new Error("Listing not found");
        err.status = 404;
        throw err;
    }

    const reviews = listing.reviews || [];
    if (reviews.length < MIN_REVIEWS) {
        return {
            summary: "There are not enough reviews yet to generate an AI summary for this stay.",
            positivePoints: [],
            negativePoints: [],
            insufficient: true,
            cached: false,
        };
    }

    const currentHash = hashReviews(reviews);

    // Return cached summary when the reviews have not changed.
    if (
        !force &&
        listing.aiReviewSummary &&
        listing.aiReviewSummaryHash === currentHash
    ) {
        return { ...listing.aiReviewSummary, cached: true };
    }

    // Build the review text block sent to Gemini.
    const reviewText = reviews
        .map(
            (r, i) =>
                `Review ${i + 1} (rating: ${r.rating || "N/A"}/5): ${r.comment || ""}`
        )
        .join("\n");

    const prompt = `Summarize the following guest reviews for the property "${listing.title}":\n\n${reviewText}`;

    const structured = await generateStructured({
        systemInstruction: SYSTEM_INSTRUCTION,
        prompt,
        responseSchema: RESPONSE_SCHEMA,
    });

    const result = {
        summary: structured.summary || "",
        positivePoints: structured.positivePoints || [],
        negativePoints: structured.negativePoints || [],
        insufficient: Boolean(structured.insufficient),
    };

    // Persist to cache (best-effort; failure to cache must not break the API).
    try {
        listing.aiReviewSummary = result;
        listing.aiReviewSummaryHash = currentHash;
        listing.aiReviewSummaryGeneratedAt = new Date();
        await listing.save();
    } catch (_) {
        /* ignore cache write errors */
    }

    return { ...result, cached: false };
}

module.exports = { getReviewSummary };
