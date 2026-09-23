# 🏡 WanderStay — Premium Stay Booking & Property Hosting Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/ec2/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Verified-0C2340?logo=razorpay&logoColor=blue)](https://razorpay.com/)

> An **Airbnb-inspired** full-stack web application designed for discovering, booking, hosting, and reviewing unique properties, luxury villas, mountain cabins, and beachfront stays around the world.

---

## 🌟 Key Features

### 🎨 1. Airbnb-Inspired Design & Global Dark Mode
- **Sleek Aesthetics**: Designed with modern typography, smooth glassmorphism, responsive grids, and subtle micro-animations.
- **☀️/🌙 Dark Mode**: Persistent light and dark theme system accessible via a Sun/Moon navbar control.
- **💀 Layout Skeleton Loaders**: High-performance animated shimmer skeletons across all pages and components for seamless user feedback during data loading.

### 🔐 2. Flexible Authentication
- **Local Authentication**: Secure email/username registration and login powered by `Passport-Local`.
- **Google OAuth 2.0**: One-click Google Sign-In via `Passport-Google-OAuth20`.
- **Persistent Sessions**: Express sessions backed by MongoDB (`connect-mongo`) with HTTP-Only secure cookies.

### 🏡 3. Stay Catalog, Hosting & Admin Approval Workflow
- **Explore Stays**: Browse properties filtered by categories (*Rooms, Trending, Iconics, Mountains, Castles, Beachfront*).
- **Host Your Space**: Form to list new properties with pricing, city, country, categories, and image upload.
- **Admin Approval Queue**: Newly submitted stays default to `isApproved: false` and must be approved by an Administrator before appearing on the public catalog.

### 💳 4. Razorpay Payment Gateway Integration
- **Real-Time Order Creation**: Generates Razorpay payment orders dynamically based on night rates and guest count.
- **Checkout Modal**: Integrated Razorpay payment sheet allowing test payments via UPI, Credit/Debit cards, and NetBanking.
- **Payment Verification**: Server-side signature verification ensuring legitimate transactions before reserving stays.

### 🛡️ 5. Dedicated Admin Portal
- **Restricted Access**: Exclusive administrative controls restricted to designated administrator accounts.
- **Analytics Overview**: Real-time stats dashboard tracking total stays, bookings, revenue (₹), and review counts.
- **Moderation Tools**: One-click approval for pending stays, direct hotel links in comment reviews, and booking cancellation tools.

### 📍 6. Interactive Maps & Geocoding
- **Mapbox Vector Maps**: Interactive 3D vector map rendering listing locations with custom property markers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, Lucide React Icons, Mapbox GL JS, Axios, React Hot Toast |
| **Backend** | Node.js (v20), Express.js, MongoDB Atlas, Mongoose ODM, Passport.js, Express Session |
| **Payments** | Razorpay Node SDK & Frontend Checkout JS |
| **Authentication** | Passport-Local, Passport-Google-OAuth20 |
| **DevOps & CI/CD** | Docker (Multi-stage Build), GitHub Actions, AWS EC2, Nginx, PM2 |

---

## 📁 Repository Structure

```text
WanderStay/
├── app.js                    # Express Application Entrypoint
├── controllers/              # Business Logic (listing, review, user, reservation, admin)
├── models/                   # Mongoose Schemas (listing, review, user, reservation)
├── routes/                   # API Express Routers
├── middleware.js             # Auth, Permissions & Validation Middlewares
├── Dockerfile                # Multi-stage Docker Container Definition
├── .dockerignore             # Docker Ignore File
├── nginx.conf.example        # Nginx Configuration Reference
├── .github/
│   └── workflows/
│       ├── main.yml          # GitHub Actions CI/CD Deployment Workflow
│       └── deploy.yml        # Alternative Deployment Workflow
└── frontend/                 # React Vite Client
    ├── src/
    │   ├── components/       # Navbar, Footer, ListingCard, CategoryFilterBar, Skeleton, Map
    │   ├── context/          # AuthContext, ThemeContext
    │   ├── pages/            # ListingsIndexPage, ListingDetailPage, ListingFormPage, ReservationsPage, AdminDashboardPage
    │   ├── App.jsx           # App Routing & Providers
    │   └── main.jsx          # Vite Entrypoint & Axios Configuration
    ├── index.html
    ├── vite.config.js
    └── vercel.json           # Vercel SPA Proxy Rewrites
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas URI)

### 2. Clone & Install Backend
```bash
git clone https://github.com/Asjdnnc/WanderStay.git
cd WanderStay

# Install backend dependencies
npm install
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/project
SECRET=thisshouldbeabettersecret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback
```

### 5. Run Backend & Frontend Concurrent Servers
```bash
# Terminal 1: Backend Express Server
node app.js

# Terminal 2: Frontend React Vite Server
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser!

---

## 🐳 Docker & AWS EC2 Deployment Guide

### Run via Docker Locally
```bash
# Build production Docker image
docker build -t wanderstay-app .

# Run container mapping port 80 to 8080
docker run -d -p 80:8080 --env-file .env --name wanderstay wanderstay-app
```

### Automated CI/CD Deployment to AWS EC2
1. Add `EC2_HOST`, `EC2_USERNAME`, and `EC2_SSH_KEY` to your GitHub Repository Secrets (**Settings > Secrets and variables > Actions**).
2. Push your changes to `master`:
   ```bash
   git add .
   git commit -m "Deploy WanderStay update"
   git push origin master
   ```
3. GitHub Actions will SSH into your EC2 instance, build the multi-stage Docker container, and deploy your live site automatically!

---

## 🤖 AI Features (Gemini + Qdrant RAG)

WanderStay ships with **two AI capabilities** layered on top of the existing MERN
stack. Both run entirely in the Node/Express backend — **no Python, no FastAPI,
no agents** — and MongoDB stays the single source of truth. API keys live only in
backend environment variables and are never exposed to React.

### 1. Overall AI Architecture

```text
                         ┌──────────────────────────────────────────────┐
                         │                React Frontend                 │
                         │  AiReviewSummary.jsx   •   AiSearchPage.jsx    │
                         └───────────────┬───────────────┬───────────────┘
                                         │ POST          │ POST
                          /api/ai/review-summary/:id   /api/ai/search
                                         │               │
                         ┌───────────────▼───────────────▼───────────────┐
                         │            Express Backend (/api/ai)           │
                         │  controllers/ai.js  →  services/*              │
                         └───────┬─────────────────┬──────────────┬──────┘
                                 │                 │              │
                     reviewSummaryService     ragService     embeddingService
                                 │                 │              │
                 ┌───────────────▼──┐    ┌─────────▼───────┐  ┌───▼─────────┐
                 │     MongoDB      │    │     Qdrant      │  │   Gemini    │
                 │ (source of truth)│◀──▶│ (vector search) │  │ (LLM + emb) │
                 └──────────────────┘    └─────────────────┘  └─────────────┘
```

### 2. How Review Summarization Works
- Endpoint: `POST /api/ai/review-summary/:listingId`
- The listing's reviews are fetched from **MongoDB** and sent to Gemini with a
  strict system instruction ("only summarize supplied reviews, never invent").
- Gemini returns **structured JSON** (`responseSchema`): `summary`,
  `positivePoints[]`, `negativePoints[]`, `insufficient`.
- **Caching:** the summary + a SHA-256 hash of the reviews are stored on the
  Listing document (`aiReviewSummary`, `aiReviewSummaryHash`). Gemini is only
  re-called when the reviews actually change, so unchanged listings are free.
- Rendered by `frontend/src/components/AiReviewSummary.jsx` on the listing page.

### 3. What Embeddings Are
An **embedding** is a numeric vector that captures the *meaning* of text.
Similar meanings produce nearby vectors, enabling semantic (not keyword) search.
We use the dedicated Gemini embedding model `gemini-embedding-001`
(dimension **768**) — *not* the text-generation model — via the reusable
`generateEmbedding(text)` in `services/embeddingService.js`. The same function
embeds both property documents and user queries so their vectors are comparable.

### 4. How Property Documents Are Indexed
Each listing is converted into a meaningful text document, e.g.:

```text
Property: Sea View Villa
Location: Baga, Goa
Price: 3800 per night
Rating: 4.7
Amenities: WiFi, Swimming Pool, Parking
Description: Beautiful villa located near Baga beach...
```

`ragService.indexListing()` embeds that text and upserts it into Qdrant with a
lightweight metadata payload (`listingId`, title, location, price, rating,
amenities). Indexing is triggered when a listing is **created/approved**,
**updated**, or via the explicit indexing job (below). MongoDB is **not**
duplicated into Qdrant — only what's needed for retrieval.

### 5. How Qdrant Is Used
Qdrant stores one vector per approved listing in the `wanderstay_listings`
collection (Cosine distance). Point IDs are derived **deterministically** from
the MongoDB `_id` (MD5→UUID), so re-running the indexer **upserts** and never
creates duplicates (idempotent). Qdrant is used **only** for semantic retrieval
of listing IDs.

### 6. How Semantic Search Works
The user query is embedded with the same model, then Qdrant returns the top-K
most similar listing IDs by vector similarity.

### 7. How RAG Works
- Endpoint: `POST /api/ai/search` with `{ "query": "..." }`
- Flow: validate query → embed → Qdrant search → **re-fetch authoritative
  listings from MongoDB** by ID → build a grounded context → send context +
  query to Gemini → return `{ answer, recommendations[], listings[] }`.
- The frontend renders the returned **real MongoDB listings** via `ListingCard`,
  so price/name/rating shown are always authoritative — never LLM-invented.

### 8. How Gemini Is Used
- **Text generation** (`gemini-2.5-flash`): review summaries and RAG answers,
  both forced into structured JSON via `responseSchema`.
- **Embeddings** (`gemini-embedding-001`): vectorizing documents and queries.

### 9. How Hallucination / Grounding Is Handled
- Strict system instructions: answer **only** from the provided context, never
  invent names/prices/ratings/amenities/availability.
- The LLM must return `listingId`s copied from context; the backend **discards**
  any recommendation whose ID isn't in the retrieved MongoDB set.
- All displayed data comes from MongoDB, not the vector payload or the LLM.

### 10. Environment Variables Required
See `.env.example`. AI-specific keys (backend only):

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash            # optional
GEMINI_EMBEDDING_MODEL=gemini-embedding-001  # optional
EMBEDDING_DIMENSION=768                   # optional (must match index & query)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=                           # required for Qdrant Cloud
QDRANT_COLLECTION=wanderstay_listings     # optional
```

### 11. How to Create the Qdrant Collection
Start Qdrant locally with Docker (or use Qdrant Cloud):

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

The collection is created automatically (`ensureCollection`) the first time you
run the indexer or hit a search — no manual step needed.

### 12. How to Run the Listing Indexing Process
```bash
npm run index:listings
```
This connects to MongoDB, ensures the Qdrant collection exists, embeds every
approved listing, and upserts the vectors. It is **idempotent** — safe to run
repeatedly. Admins can also trigger a re-index via `POST /api/ai/index`.

### 13. Running the App Locally (with AI)
1. Add `GEMINI_API_KEY` and `QDRANT_URL` to `.env` (see `.env.example`).
2. Start Qdrant (Docker command above) if running locally.
3. Start the backend: `npm run dev` (or `node app.js`).
4. (Optional) Seed sample Indian listings: `npm run seed:india`
   (non-destructive & idempotent — adds Goa/Manali/Jaipur/etc. as approved).
5. Build the index once: `npm run index:listings`.
5. Start the frontend: `cd frontend && npm run dev`.
6. Open `http://localhost:5173` → try **AI Search** in the navbar, and open any
   listing to generate its **AI Review Summary**.

> If `GEMINI_API_KEY` is not set, the AI endpoints return a friendly `503` and
> the rest of WanderStay keeps working normally.

---

## 🤝 Author & Acknowledgements

- **Developed by**: [Aditya Kumar](https://github.com/Asjdnnc)
- Inspired by **Airbnb** for UI/UX concepts.
