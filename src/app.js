
// create server
const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner-routes');
const commentRoutes = require('./routes/comment.routes');

const cors = require('cors');

const app = express();

// Allowed frontend origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://flavour-frontend.vercel.app"
];

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            (
                origin.endsWith(".vercel.app") &&
                origin.includes("flavour-frontend")
            )
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
app.use('/api/comments', commentRoutes);

module.exports = app;
