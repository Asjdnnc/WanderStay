require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 8080;
const mongodb = "mongodb://127.0.0.1:27017/project";
const dbUrl = process.env.MONGODB_URI || process.env.ATLASDB_URL || mongodb;
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const reservationRouter = require("./routes/reservation.js");
const adminRouter = require("./routes/admin.js");


const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const localStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user.js");

// Enable trust proxy for Render / Vercel SSL termination
app.set('trust proxy', 1);

const allowedOrigins = [
    'https://wander-stay-wheat.vercel.app',
    'http://localhost:5173',
    'http://localhost:8080'
];

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    collectionName: "secure_sessions"
});
store.on("error", (err) => {
    console.log("error in mongo session store", err);
});

const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER;

const sessionOptions = {
    store,
    secret: process.env.SECRET || "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd ? true : false
    }
};


app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            const { id, displayName, emails } = profile;
            try {
                let user = await User.findOne({ googleId: id });
                if (!user) {
                    user = await User.findOne({ email: emails[0].value });
                    if (user) {
                        user.googleId = id;
                        user.username = displayName;
                    } else {
                        user = await User.create({
                            googleId: id,
                            email: emails[0].value,
                            username: displayName,
                        });
                    }
                    await user.save();
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }));

    app.get('/api/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/api/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res) => {
            const frontendUrl = process.env.FRONTEND_URL || 'https://wander-stay-wheat.vercel.app';
            res.redirect(frontendUrl);
        }
    );

}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

main()
    .then(() => {
        console.log("MongoDB Connection successful");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
    });

async function main() {
    await mongoose.connect(dbUrl);
    try {
        await User.updateMany(
            { $or: [{ email: "aditya05yt@gmail.com" }, { _id: "667a2b1de114dd80462e0e54" }] },
            { $set: { isAdmin: true } }
        );
        console.log("Admin privileges active for aditya05yt@gmail.com");
    } catch (e) { }
}


// API Route Mounts
app.use("/api/listings", listingsRouter);
app.use("/api/listings/:id/reviews", reviewsRouter);
app.use("/api/auth", userRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/admin", adminRouter);


// Backward compatibility mounts
app.use("/wanderstay/listings", listingsRouter);
app.use("/wanderstay/listings/:id/reviews", reviewsRouter);
app.use("/wanderstay", userRouter, reservationRouter);

// Serve React production build if available
const frontendDistPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendDistPath));

app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
        return next(new ExpressError(404, "API endpoint not found"));
    }
    const indexHtml = path.join(frontendDistPath, "index.html");
    if (require('fs').existsSync(indexHtml)) {
        return res.sendFile(indexHtml);
    }
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).json({ success: false, message });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


