/**
 * scripts/seedIndianListings.js
 * ------------------------------------------------------------------
 * Adds synthetic Indian property listings (Goa, Manali, Jaipur, ...) to
 * MongoDB WITHOUT wiping existing data.
 *
 * - Idempotent: any previously-seeded listing with the same title is removed
 *   first, so re-running never creates duplicates.
 * - Listings are inserted with isApproved: true so they appear publicly and
 *   are eligible for AI/RAG indexing.
 *
 * Usage:  npm run seed:india
 *   then: npm run index:listings   (to make them searchable via AI search)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { indianListings } = require("../init/indianListings");

const dbUrl =
    process.env.MONGODB_URI ||
    process.env.ATLASDB_URL ||
    "mongodb://127.0.0.1:27017/project";

async function run() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);

    const titles = indianListings.map((l) => l.title);

    // Idempotency: remove prior copies of these exact listings.
    const removed = await Listing.deleteMany({ title: { $in: titles } });
    if (removed.deletedCount) {
        console.log(`Removed ${removed.deletedCount} existing seed listing(s) for a clean re-seed.`);
    }

    const docs = indianListings.map((l) => ({ ...l, isApproved: true }));
    const inserted = await Listing.insertMany(docs);
    console.log(`Inserted ${inserted.length} Indian listings (isApproved: true).`);
    console.log("Next: run `npm run index:listings` to make them AI-searchable.");
}

run()
    .then(async () => {
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(async (err) => {
        console.error("Seeding failed:", err.message);
        await mongoose.disconnect().catch(() => {});
        process.exit(1);
    });
