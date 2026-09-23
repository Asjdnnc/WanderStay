/**
 * scripts/indexListings.js
 * ------------------------------------------------------------------
 * One-off / repeatable indexing job:
 *   1. Connect to MongoDB.
 *   2. Ensure the Qdrant collection exists.
 *   3. Generate embeddings for every approved listing and upsert into Qdrant.
 *
 * Idempotent: point IDs are derived from the listing _id, so running it
 * multiple times updates (never duplicates) vectors.
 *
 * Usage:  npm run index:listings
 */
require("dotenv").config();
const mongoose = require("mongoose");
const ragService = require("../services/ragService");

const dbUrl =
    process.env.MONGODB_URI ||
    process.env.ATLASDB_URL ||
    "mongodb://127.0.0.1:27017/project";

async function run() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);
    console.log("Connected. Indexing listings into Qdrant...");

    const result = await ragService.indexAllListings();
    console.log(
        `Done. Indexed ${result.indexed}/${result.total} listings.`
    );
    if (result.errors.length) {
        console.warn(`${result.errors.length} listing(s) failed:`);
        result.errors.forEach((e) => console.warn(`  - ${e.listingId}: ${e.error}`));
    }
}

run()
    .then(async () => {
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(async (err) => {
        console.error("Indexing failed:", err.message);
        await mongoose.disconnect().catch(() => {});
        process.exit(1);
    });
