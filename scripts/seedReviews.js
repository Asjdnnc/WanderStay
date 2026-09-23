/**
 * scripts/seedReviews.js
 * ------------------------------------------------------------------
 * Adds synthetic guest reviews to every listing that has fewer than
 * MIN_REVIEWS reviews, so the AI Review Summary has data to work with.
 *
 * - Non-destructive: existing reviews are never touched.
 * - Idempotent: listings that already have MIN_REVIEWS or more are skipped,
 *   so re-running does not keep piling on reviews.
 * - Comments are themed from the listing's categories/description and mix
 *   praise with complaints so summaries have both positive and negative points.
 * - Authors are picked from existing users (no accounts are created).
 *
 * Usage:  npm run seed:reviews
 *   then: npm run index:listings   (refreshes ratings stored in Qdrant)
 */
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");

const dbUrl =
    process.env.MONGODB_URI ||
    process.env.ATLASDB_URL ||
    "mongodb://127.0.0.1:27017/project";

const MIN_REVIEWS = 4;
const MAX_REVIEWS = 6;

// Theme-specific praise/complaints, matched against categories + description.
const THEMES = {
    beach: {
        match: /beach|sea|coast|ocean|island|goa|gokarna/i,
        pros: ["the beach is just a short walk away", "waking up to the sound of the waves was magical", "the sunset views were unforgettable", "perfect spot for water sports and beach cafes"],
        cons: ["sand gets everywhere in the rooms", "it gets quite humid in the afternoons", "the area around the beach was crowded on weekends", "the beach shacks nearby were noisy late at night"],
    },
    mountain: {
        match: /mountain|himalaya|hill|manali|shimla|darjeeling|munnar|nainital|valley|snow|ski/i,
        pros: ["the mountain views from the balcony were breathtaking", "the fireplace kept us cozy on cold nights", "fresh air and peaceful surroundings", "great base for treks and sightseeing"],
        cons: ["the road up to the property is steep and narrow", "hot water ran out in the mornings", "it gets very cold at night, bring warm clothes", "mobile network was patchy"],
    },
    pool: {
        match: /pool/i,
        pros: ["the swimming pool was clean and well maintained", "kids loved spending the afternoons in the pool", "the pool area was great for relaxing"],
        cons: ["the pool was not heated so it was chilly in the evening", "the pool area could use more loungers"],
    },
    heritage: {
        match: /castle|haveli|palace|heritage|colonial|fort|iconic/i,
        pros: ["the heritage architecture and decor were stunning", "felt like staying in a piece of history", "the staff shared wonderful stories about the property"],
        cons: ["some rooms feel dated and need renovation", "the old walls make the rooms a bit dark", "bathroom fittings were old"],
    },
    city: {
        match: /city|downtown|apartment|loft|urban|mumbai|metro/i,
        pros: ["the location was central and close to everything", "plenty of restaurants and cafes within walking distance", "the apartment was modern and stylish"],
        cons: ["street noise was noticeable at night", "parking in the area was difficult", "the building lift was slow"],
    },
    nature: {
        match: /camp|tent|desert|farm|plantation|tea|coffee|forest|dome|arctic|river|boat|houseboat|backwater/i,
        pros: ["a truly unique experience close to nature", "the food prepared by the hosts was delicious", "stargazing at night was the highlight of our trip"],
        cons: ["insects were a bit of a problem in the evenings", "the property is quite remote, you need your own transport", "facilities are basic compared to a hotel"],
    },
};

const GENERIC = {
    pros: ["the host was very friendly and responsive", "rooms were spotless and well maintained", "check-in was smooth and easy", "great value for money", "the beds were really comfortable", "WiFi was fast and reliable", "the photos match the real place"],
    cons: ["the WiFi was slow at times", "parking space was limited", "the kitchen was missing a few basic utensils", "check-in took longer than expected", "the walls were thin and we could hear neighbours", "housekeeping was a bit inconsistent"],
};

const OPENERS = {
    5: ["Absolutely loved our stay!", "One of the best stays we've had.", "Highly recommend this place!", "Exceeded our expectations."],
    4: ["Really enjoyed our stay.", "Lovely place overall.", "A very pleasant stay.", "Good experience overall."],
    3: ["Decent stay, but with some issues.", "It was okay.", "Mixed feelings about this one.", "Average experience."],
    2: ["Disappointing stay.", "Not quite what we expected.", "Would not stay again."],
};

// Deterministic PRNG seeded per listing so output is stable across runs.
function makeRng(seedText) {
    let seed = crypto.createHash("md5").update(String(seedText)).digest().readUInt32LE(0);
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function themesFor(listing) {
    const text = `${(listing.categories || []).join(" ")} ${listing.title} ${listing.description || ""}`;
    return Object.values(THEMES).filter((t) => t.match.test(text));
}

// A listing's "quality profile" controls its rating distribution, so different
// listings get meaningfully different summaries.
function ratingFor(rng, profile) {
    const r = rng();
    if (profile === "great") return r < 0.65 ? 5 : r < 0.95 ? 4 : 3;
    if (profile === "good") return r < 0.3 ? 5 : r < 0.8 ? 4 : 3;
    return r < 0.15 ? 5 : r < 0.45 ? 4 : r < 0.85 ? 3 : 2; // mixed
}

function buildComment(rng, rating, themes) {
    const pros = [...GENERIC.pros, ...themes.flatMap((t) => t.pros)];
    const cons = [...GENERIC.cons, ...themes.flatMap((t) => t.cons)];

    const pro1 = pick(rng, pros);
    let pro2 = pick(rng, pros);
    if (pro2 === pro1) pro2 = null;
    const con = pick(rng, cons);

    let body;
    if (rating === 5) {
        body = `${capitalize(pro1)}${pro2 ? ` and ${pro2}` : ""}.`;
        if (rng() < 0.3) body += ` Only small complaint: ${con}.`;
    } else if (rating === 4) {
        body = `${capitalize(pro1)}. The one downside was that ${con}.`;
    } else if (rating === 3) {
        body = `${capitalize(pro1)}, but ${con}.`;
        if (rng() < 0.5) body += ` Also, ${pick(rng, cons)}.`;
    } else {
        body = `${capitalize(con)}, and ${pick(rng, cons)}. On the plus side, ${pro1}.`;
    }
    return `${pick(rng, OPENERS[rating])} ${body}`;
}

async function run() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);

    const users = await User.find({}).select("_id");
    if (!users.length) {
        console.warn("No users found — reviews will be created without an author.");
    }

    const listings = await Listing.find({ [`reviews.${MIN_REVIEWS - 1}`]: { $exists: false } });
    console.log(`${listings.length} listing(s) have fewer than ${MIN_REVIEWS} reviews.`);

    let created = 0;
    for (const listing of listings) {
        const rng = makeRng(listing._id);
        const profile = pick(rng, ["great", "great", "good", "good", "mixed"]);
        const themes = themesFor(listing);

        const target = MIN_REVIEWS + Math.floor(rng() * (MAX_REVIEWS - MIN_REVIEWS + 1));
        const toAdd = Math.max(0, target - (listing.reviews?.length || 0));

        // Shuffle users so a listing doesn't get two reviews from the same person.
        const authors = [...users].sort(() => rng() - 0.5);

        const docs = [];
        for (let i = 0; i < toAdd; i++) {
            const rating = ratingFor(rng, profile);
            const daysAgo = Math.floor(rng() * 365) + 1;
            docs.push({
                rating,
                comment: buildComment(rng, rating, themes),
                author: authors.length ? authors[i % authors.length]._id : undefined,
                createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            });
        }
        if (!docs.length) continue;

        const inserted = await Review.insertMany(docs);
        await Listing.updateOne(
            { _id: listing._id },
            { $push: { reviews: { $each: inserted.map((r) => r._id) } } }
        );
        created += inserted.length;
    }

    console.log(`Added ${created} review(s) across ${listings.length} listing(s).`);
    console.log("Next: run `npm run index:listings` to refresh ratings in Qdrant.");
}

run()
    .then(async () => {
        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(async (err) => {
        console.error("Review seeding failed:", err.message);
        await mongoose.disconnect().catch(() => {});
        process.exit(1);
    });
