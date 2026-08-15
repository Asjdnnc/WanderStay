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

## 🤝 Author & Acknowledgements

- **Developed by**: [Aditya Kumar](https://github.com/Asjdnnc)
- Inspired by **Airbnb** for UI/UX concepts.
