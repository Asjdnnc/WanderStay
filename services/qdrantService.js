/**
 * qdrantService.js
 * ------------------------------------------------------------------
 * Wraps the Qdrant vector database client. Qdrant is used ONLY for semantic
 * retrieval of listing IDs — MongoDB remains the source of truth for all
 * authoritative data (price, rating, amenities, availability, details).
 *
 * Point IDs are derived deterministically from the MongoDB _id so that
 * re-running the indexer upserts (never duplicates) the same vector.
 */
const crypto = require("crypto");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { EMBEDDING_DIMENSION } = require("./embeddingService");

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || undefined;
const COLLECTION = process.env.QDRANT_COLLECTION || "wanderstay_listings";

let client = null;

function getClient() {
    if (!client) {
        client = new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY });
    }
    return client;
}

/**
 * Convert a MongoDB ObjectId string into a deterministic UUID so the same
 * listing always maps to the same Qdrant point (idempotent upserts).
 */
function listingIdToPointId(listingId) {
    const hash = crypto.createHash("md5").update(String(listingId)).digest("hex");
    return [
        hash.slice(0, 8),
        hash.slice(8, 12),
        hash.slice(12, 16),
        hash.slice(16, 20),
        hash.slice(20, 32),
    ].join("-");
}

/**
 * Ensure the Qdrant collection exists with the correct vector size. Safe to
 * call repeatedly — it only creates the collection when missing.
 */
async function ensureCollection() {
    const qdrant = getClient();
    const { collections } = await qdrant.getCollections();
    const exists = collections.some((c) => c.name === COLLECTION);
    if (!exists) {
        await qdrant.createCollection(COLLECTION, {
            vectors: { size: EMBEDDING_DIMENSION, distance: "Cosine" },
        });
    }
    return COLLECTION;
}

/**
 * Upsert a single listing vector + metadata payload.
 * @param {Object} params
 * @param {string} params.listingId
 * @param {number[]} params.vector
 * @param {Object} params.payload - lightweight metadata (see ragService).
 */
async function upsertListing({ listingId, vector, payload }) {
    const qdrant = getClient();
    await qdrant.upsert(COLLECTION, {
        wait: true,
        points: [
            {
                id: listingIdToPointId(listingId),
                vector,
                payload: { listingId: String(listingId), ...payload },
            },
        ],
    });
}

/**
 * Semantic similarity search. Returns the payloads (incl. listingId) of the
 * top matches. An optional Qdrant filter can apply metadata/business filters.
 */
async function search({ vector, limit = 5, filter = undefined }) {
    const qdrant = getClient();
    // Newer @qdrant/js-client-rest replaced `search` with the universal `query`
    // API, which returns { points: [...] }.
    const response = await qdrant.query(COLLECTION, {
        query: vector,
        limit,
        filter,
        with_payload: true,
    });
    const points = response.points || [];
    return points.map((r) => ({ score: r.score, ...r.payload }));
}

/** Remove a listing's vector (e.g. when a listing is deleted). */
async function deleteListing(listingId) {
    const qdrant = getClient();
    await qdrant.delete(COLLECTION, {
        wait: true,
        points: [listingIdToPointId(listingId)],
    });
}

module.exports = {
    getClient,
    ensureCollection,
    upsertListing,
    search,
    deleteListing,
    listingIdToPointId,
    COLLECTION,
    isConfigured: () => Boolean(process.env.QDRANT_URL),
};
