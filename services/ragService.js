/**
 * ragService.js
 * ------------------------------------------------------------------
 * Orchestrates the RAG pipeline:
 *   1. Convert a MongoDB listing into a meaningful text document.
 *   2. Generate an embedding and upsert it into Qdrant (indexing).
 *   3. For a user query: embed -> Qdrant similarity search -> re-fetch the
 *      authoritative listings from MongoDB -> build a grounded prompt ->
 *      Gemini -> structured { answer, recommendations[] }.
 *
 * MongoDB is always the source of truth for display data; Qdrant payloads are
 * only used to locate relevant listing IDs.
 */
const Listing = require("../models/listing");
const { generateEmbedding } = require("./embeddingService");
const qdrantService = require("./qdrantService");
const { generateStructured } = require("./geminiService");

/** Average review rating for a listing (or null when there are none). */
function averageRating(reviews = []) {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Number((sum / reviews.length).toFixed(2));
}

/**
 * Build a human-readable text representation of a listing for embedding.
 * `categories` are used as the property's amenities/features.
 */
function buildListingDocument(listing) {
    const rating = averageRating(listing.reviews);
    const amenities = (listing.categories || []).join(", ") || "Not specified";
    return [
        `Property: ${listing.title}`,
        `Location: ${listing.location}, ${listing.country}`,
        `Price: ${listing.price} per night`,
        `Rating: ${rating !== null ? rating : "No ratings yet"}`,
        `Amenities: ${amenities}`,
        `Description: ${listing.description || ""}`,
    ].join("\n");
}

/** Lightweight metadata payload stored alongside the vector in Qdrant. */
function buildPayload(listing) {
    return {
        title: listing.title,
        location: listing.location,
        country: listing.country,
        price: listing.price,
        rating: averageRating(listing.reviews),
        amenities: listing.categories || [],
    };
}

/**
 * Index a single listing into Qdrant. Idempotent (upsert by deterministic ID).
 * Reusable when a property is created or updated.
 */
async function indexListing(listing) {
    const text = buildListingDocument(listing);
    const vector = await generateEmbedding(text);
    await qdrantService.upsertListing({
        listingId: listing._id,
        vector,
        payload: buildPayload(listing),
    });
    return listing._id;
}

/**
 * Index every approved listing. Ensures the collection exists first.
 * Returns a small summary for scripts/endpoints.
 */
async function indexAllListings() {
    await qdrantService.ensureCollection();
    const listings = await Listing.find({ isApproved: { $ne: false } })
        .populate("reviews", "rating");

    let indexed = 0;
    const errors = [];
    for (const listing of listings) {
        try {
            await indexListing(listing);
            indexed += 1;
        } catch (err) {
            errors.push({ listingId: String(listing._id), error: err.message });
        }
    }
    return { total: listings.length, indexed, errors };
}

const RAG_SYSTEM_INSTRUCTION = `You are Wanderstay's AI property assistant.

Answer the user's question using ONLY the property information provided in the context.

Never invent property names, prices, ratings, amenities, locations, availability or property features.

If the provided context does not contain enough information to answer the question, clearly say that sufficient information was not found.

Do not use your general knowledge about properties.

When recommending properties, explain briefly why each property matches the user's request.

Return the exact listingId of each recommended property (copied verbatim from the context) so the frontend can link the answer to the real Wanderstay listings. Only recommend properties present in the context.`;

const RAG_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        answer: { type: "string" },
        recommendations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    listingId: { type: "string" },
                    reason: { type: "string" },
                },
                required: ["listingId", "reason"],
            },
        },
    },
    required: ["answer", "recommendations"],
};

/**
 * Build the grounded context string from authoritative MongoDB records.
 */
function buildGroundedContext(listings) {
    return listings
        .map((l) => {
            const rating = averageRating(l.reviews);
            const amenities = (l.categories || []).join(", ") || "Not specified";
            return [
                `listingId: ${l._id}`,
                `Property: ${l.title}`,
                `Location: ${l.location}, ${l.country}`,
                `Price: ${l.price} per night`,
                `Rating: ${rating !== null ? rating : "No ratings yet"}`,
                `Amenities: ${amenities}`,
                `Description: ${l.description || ""}`,
            ].join("\n");
        })
        .join("\n\n---\n\n");
}

/**
 * Full RAG search for a natural-language query.
 * @returns {Promise<{answer:string, recommendations:Array, listings:Array}>}
 */
async function search(query, { topK = 5, minScore = 0.70 } = {}) {
    // 1. Embed the query with the SAME model used for indexing.
    const queryVector = await generateEmbedding(query);

    // 2. Vector similarity search in Qdrant -> candidate listing IDs.
    const matches = await qdrantService.search({ vector: queryVector, limit: topK });
    
    // Filter matches that do not meet the minimum similarity threshold
    const candidateIds = matches
        .filter((m) => m.score >= minScore)
        .map((m) => m.listingId)
        .filter(Boolean);

    if (candidateIds.length === 0) {
        return {
            answer: "Sufficient information was not found. No matching properties are available in our catalog for this request.",
            recommendations: [],
            listings: [],
        };
    }

    // 3. Re-fetch the AUTHORITATIVE listings from MongoDB (never trust payloads
    //    for display data). Keep only approved listings.
    const listings = await Listing.find({
        _id: { $in: candidateIds },
        isApproved: { $ne: false },
    }).populate("reviews", "rating");

    if (listings.length === 0) {
        return {
            answer: "Sufficient information was not found. No matching properties are available in our catalog for this request.",
            recommendations: [],
            listings: [],
        };
    }

    // Preserve Qdrant relevance ordering.
    const orderedListings = candidateIds
        .map((id) => listings.find((l) => String(l._id) === String(id)))
        .filter(Boolean);

    // 4. Build grounded prompt + call Gemini for a structured answer.
    const context = buildGroundedContext(orderedListings);
    const prompt = `Context (the ONLY properties you may reference):\n\n${context}\n\nUser question: ${query}`;

    const structured = await generateStructured({
        systemInstruction: RAG_SYSTEM_INSTRUCTION,
        prompt,
        responseSchema: RAG_RESPONSE_SCHEMA,
    });

    // 5. Only keep recommendations whose IDs actually exist in our results.
    const validIds = new Set(orderedListings.map((l) => String(l._id)));
    const recommendations = (structured.recommendations || []).filter((r) =>
        validIds.has(String(r.listingId))
    );

    // Return authoritative listing docs so the frontend renders real data.
    const recommendedListings = recommendations
        .map((r) => orderedListings.find((l) => String(l._id) === String(r.listingId)))
        .filter(Boolean);

    return {
        answer: structured.answer,
        recommendations,
        listings: recommendedListings.length ? recommendedListings : orderedListings,
    };
}

module.exports = {
    buildListingDocument,
    indexListing,
    indexAllListings,
    search,
};
