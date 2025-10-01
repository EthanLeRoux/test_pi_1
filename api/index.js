const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { router: motionRoutes, connectMongo } = require('./routes/motionroutes');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ALLOWED_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // JSON body parsing

// Routes will be mounted after DB is ready

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectMongo(); // ensure MongoDB is connected before routes are used
        app.use('/api/motion', motionRoutes);

        app.listen(PORT, () => {
            console.log(`✅ Server started on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1); // exit if DB connection fails
    }
})();
