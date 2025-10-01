const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGO_URI; // store your Mongo URI in .env
const client = new MongoClient(uri, { useUnifiedTopology: true });
const dbName = "iot"; // your database name
let motionsCollection;

// Connect to MongoDB once and reuse the collection
async function connectMongo() {
    if (!motionsCollection) {
        await client.connect();
        const db = client.db(dbName);
        motionsCollection = db.collection("motions");
        console.log("Connected to MongoDB");
    }
}
connectMongo().catch(console.error);

// POST route to save a motion document
router.post("/saveDoc", async (req, res) => {
    try {
        const { motionDuration, motionDatetime, motionLocation } = req.body;

        // Basic validation
        if (
            typeof motionDuration !== "number" ||
            !motionDatetime ||
            typeof motionLocation?.lat !== "number" ||
            typeof motionLocation?.long !== "number"
        ) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const doc = {
            motionDuration,
            motionDatetime: new Date(motionDatetime),
            motionLocation: {
                lat: motionLocation.lat,
                long: motionLocation.long,
            },
        };

        const result = await motionsCollection.insertOne(doc);
        res.status(201).json({ message: "Motion saved", id: result.insertedId });
    } catch (error) {
        console.error("Error saving motion:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET route to fetch all motion documents
router.get("/all", async (req, res) => {
    try {
        const motions = await motionsCollection
            .find()
            .sort({ motionDatetime: -1 })
            .toArray();

        if (motions.length === 0) {
            return res.status(404).json({ message: "No motion records found" });
        }

        res.status(200).json(motions);
    } catch (error) {
        console.error("Error fetching motions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
