/**
 * init/indianListings.js
 * ------------------------------------------------------------------
 * Synthetic Indian property listings (Goa, Manali, Jaipur, etc.) used to
 * populate WanderStay with realistic data for browsing and AI/RAG search.
 *
 * Notes:
 * - Prices are per-night in INR (the UI renders ₹).
 * - `categories` use the same labels as the frontend CategoryFilterBar so the
 *   category filter keeps working. They also act as "amenities" for the AI.
 * - Amenities such as WiFi / swimming pool / parking are written into the
 *   description so embeddings capture them for semantic search queries like
 *   "villa in Goa near the beach with WiFi and a pool under 4000".
 * - Seeded via scripts/seedIndianListings.js (non-destructive, idempotent).
 */
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Reuse the same demo owner id as the existing seed data.
const OWNER = new ObjectId("6674e4f1fa4549530a19acd8");

const indianListings = [
    {
        title: "Sea View Villa, Baga Beach",
        description:
            "A stunning beachfront villa just 2 minutes walk from Baga Beach in North Goa. Sleeps 4 guests across 2 bedrooms. Features a private swimming pool, fast free WiFi, air conditioning, free parking, and a sunset-facing balcony. Ideal for families and friends who want the beach at their doorstep.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60" },
        price: 3800, location: "Baga, Goa", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [73.7519, 15.5553] },
        categories: ["Beachfront", "Amazing Pools", "Trending"],
    },
    {
        title: "Palolem Beach Cottage",
        description:
            "A cozy and affordable beach cottage on the quiet Palolem Beach in South Goa. Perfect for 2 guests. Comes with WiFi, a hammock, an outdoor shower and secure parking. Steps away from cafes, kayaking and dolphin-spotting boat trips.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=60" },
        price: 2200, location: "Palolem, Goa", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [74.0233, 15.0100] },
        categories: ["Beachfront", "Rooms"],
    },
    {
        title: "Luxury Poolside Villa, Candolim",
        description:
            "Spacious 3-bedroom luxury villa in Candolim, Goa, sleeping up to 6 guests. Private infinity swimming pool, high-speed WiFi, modern kitchen, free parking and daily housekeeping. A short drive from Fort Aguada and the beach.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=60" },
        price: 6500, location: "Candolim, Goa", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [73.7626, 15.5186] },
        categories: ["Amazing Pools", "Iconics", "Beachfront"],
    },
    {
        title: "Snow View Cottage, Manali",
        description:
            "A charming wooden cottage in Old Manali with breathtaking Himalayan mountain views. Sleeps 4 guests. Includes a cozy fireplace, free WiFi, private parking, and a garden. Walking distance to cafes and the Manu Temple. Great for a cheap mountain getaway with good reviews.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=60" },
        price: 2400, location: "Old Manali, Himachal Pradesh", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [77.1783, 32.2560] },
        categories: ["Mountains", "Trending"],
    },
    {
        title: "Riverside Wooden Chalet, Manali",
        description:
            "Beautiful riverside chalet on the banks of the Beas River in Manali. Perfect for 4 people. Offers free parking, WiFi, a bonfire area, mountain views and a heated interior for winter. Close to Solang Valley for skiing and paragliding.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=800&q=60" },
        price: 3200, location: "Manali, Himachal Pradesh", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [77.1892, 32.2432] },
        categories: ["Mountains", "Camping"],
    },
    {
        title: "Heritage Haveli, Jaipur",
        description:
            "Stay like royalty in a restored 19th-century heritage haveli in the Pink City of Jaipur. Sleeps 4 guests. Ornate rooms, a rooftop restaurant, courtyard swimming pool, free WiFi and parking. Minutes from Hawa Mahal and the City Palace.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=60" },
        price: 4200, location: "Jaipur, Rajasthan", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [75.7873, 26.9124] },
        categories: ["Castles", "Iconics", "Amazing Pools"],
    },
    {
        title: "Lake Palace Suite, Udaipur",
        description:
            "A romantic suite overlooking Lake Pichola in Udaipur, the City of Lakes. Ideal for 2 guests. Includes a private balcony, swimming pool access, WiFi, air conditioning and valet parking. Perfect for honeymooners seeking iconic lake and palace views.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=60" },
        price: 5800, location: "Udaipur, Rajasthan", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [73.6845, 24.5785] },
        categories: ["Castles", "Amazing Pools", "Iconics"],
    },
    {
        title: "Ganga Riverside Retreat, Rishikesh",
        description:
            "A peaceful yoga retreat on the banks of the Ganges in Rishikesh. Sleeps 4 guests. Offers free WiFi, parking, daily yoga sessions, an organic cafe and river-rafting nearby. A tranquil spot for wellness and adventure lovers.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=60" },
        price: 2600, location: "Rishikesh, Uttarakhand", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [78.2676, 30.0869] },
        categories: ["Mountains", "Camping", "Trending"],
    },
    {
        title: "Tea Estate Bungalow, Munnar",
        description:
            "A colonial-era bungalow set inside lush tea plantations in Munnar, Kerala. Perfect for 4 guests. Features a fireplace, free WiFi, parking, misty valley views and guided plantation walks. A serene hill-station escape with excellent reviews.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=800&q=60" },
        price: 3400, location: "Munnar, Kerala", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [77.0595, 10.0889] },
        categories: ["Mountains", "Farms"],
    },
    {
        title: "Backwater Houseboat, Alleppey",
        description:
            "A traditional Kerala houseboat cruising the Alleppey backwaters. Sleeps 4 guests in 2 AC bedrooms. Includes a private chef serving fresh seafood, sun deck, WiFi and onboard dining. Glide past paddy fields and coconut groves on the water.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=60" },
        price: 7200, location: "Alleppey, Kerala", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [76.3388, 9.4981] },
        categories: ["Boat", "Iconics", "Trending"],
    },
    {
        title: "Colonial Hilltop Home, Shimla",
        description:
            "A classic British-era home on a Shimla hilltop with sweeping valley views. Sleeps 6 guests. Comes with a fireplace, free WiFi, parking, a large garden and easy access to the Mall Road. A cozy and affordable mountain retreat.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=60" },
        price: 2900, location: "Shimla, Himachal Pradesh", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [77.1734, 31.1048] },
        categories: ["Mountains", "Rooms"],
    },
    {
        title: "Himalayan View Homestay, Darjeeling",
        description:
            "A warm family homestay in Darjeeling with views of Kanchenjunga. Perfect for 2 guests. Includes home-cooked meals, free WiFi, parking, and a terrace overlooking tea gardens. Wake up to sunrise over the Himalayas at Tiger Hill nearby.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=60" },
        price: 1900, location: "Darjeeling, West Bengal", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [88.2636, 27.0360] },
        categories: ["Mountains", "Farms"],
    },
    {
        title: "Desert Camp under the Stars, Jaisalmer",
        description:
            "A luxury desert camp in the Thar Desert near Jaisalmer. Sleeps 4 guests in Swiss tents. Includes camel safaris, folk dance evenings, bonfire dinners, WiFi at the reception and parking. Sleep under a blanket of stars in the golden dunes.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=60" },
        price: 4500, location: "Jaisalmer, Rajasthan", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [70.9083, 26.9157] },
        categories: ["Camping", "Iconics", "Trending"],
    },
    {
        title: "Coffee Plantation Villa, Coorg",
        description:
            "A private villa nestled in a coffee plantation in Coorg, Karnataka. Ideal for 6 guests. Features a swimming pool, free WiFi, parking, a barbecue area and misty hill views. Enjoy plantation tours, waterfalls and Kodava cuisine.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=60" },
        price: 4800, location: "Coorg, Karnataka", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [75.7382, 12.4244] },
        categories: ["Amazing Pools", "Farms", "Mountains"],
    },
    {
        title: "Beach Hut, Gokarna",
        description:
            "A rustic beach hut right on Om Beach in Gokarna, perfect for budget travelers and couples. Sleeps 2 guests. Includes WiFi at the cafe, a hammock, and beach access. A laid-back, cheap coastal escape away from the crowds.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60" },
        price: 1500, location: "Gokarna, Karnataka", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [74.3188, 14.5479] },
        categories: ["Beachfront", "Rooms"],
    },
    {
        title: "Hilltop Villa with Pool, Lonavala",
        description:
            "A modern villa in the misty hills of Lonavala, near Mumbai and Pune. Sleeps 8 guests across 4 bedrooms. Private swimming pool, free WiFi, ample parking, a lawn and a games room. Popular monsoon getaway with waterfalls and forts nearby.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60" },
        price: 7800, location: "Lonavala, Maharashtra", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [73.4062, 18.7546] },
        categories: ["Amazing Pools", "Mountains", "Trending"],
    },
    {
        title: "Lakeview Cottage, Nainital",
        description:
            "A cozy cottage overlooking Naini Lake in the hill town of Nainital. Perfect for 4 guests. Offers a fireplace, free WiFi, parking, and a balcony facing the lake. Walk to the Mall Road, boating and cable car rides.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?auto=format&fit=crop&w=800&q=60" },
        price: 2700, location: "Nainital, Uttarakhand", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [79.4542, 29.3803] },
        categories: ["Mountains", "Rooms"],
    },
    {
        title: "Sea Facing Resort, Havelock Island",
        description:
            "A tropical resort on Havelock Island in the Andamans, near Radhanagar Beach. Sleeps 4 guests. Includes a swimming pool, free WiFi, parking, scuba diving packages and beachfront dining. Crystal-clear turquoise waters just steps away.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=60" },
        price: 6900, location: "Havelock Island, Andaman", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [92.9998, 12.0100] },
        categories: ["Beachfront", "Amazing Pools", "Iconics"],
    },
    {
        title: "French Quarter Villa, Pondicherry",
        description:
            "A pastel-colored heritage villa in the French Quarter of Pondicherry. Ideal for 4 guests. Features a courtyard, swimming pool, free WiFi, parking and bicycles. Stroll cobbled streets, seaside promenades and charming cafes.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=60" },
        price: 3600, location: "Pondicherry", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [79.8083, 11.9416] },
        categories: ["Beachfront", "Iconics", "Amazing Pools"],
    },
    {
        title: "Skyline Apartment, Mumbai",
        description:
            "A stylish high-rise apartment in Bandra, Mumbai with sea-link and skyline views. Perfect for 2 guests. Includes fast WiFi, air conditioning, gym and pool access, and secure parking. Close to cafes, nightlife and the Bandra-Worli Sea Link.",
        image: { filename: "listingimage", url: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?auto=format&fit=crop&w=800&q=60" },
        price: 5200, location: "Mumbai, Maharashtra", country: "India", owner: OWNER,
        geometry: { type: "Point", coordinates: [72.8296, 19.0596] },
        categories: ["Iconics", "Rooms", "Amazing Pools"],
    },
];

module.exports = { indianListings };
