const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Behavior = require("./models");

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb+srv://username:password@cluster0.rudax5e.mongodb.net/collection_name?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API endpoint to receive tracking data
app.post("/api/track", async (req, res) => {
  const { website, date, mouseMovements, clicks, scrollDistance, scrollSpeed, timeSpent } = req.body;

  try {
    if (!website || !date) {
      return res.status(400).json({ success: false, error: "Website and date are required" });
    }

    // Update or create document for the same website and date
    const updatedData = await Behavior.findOneAndUpdate(
      { website, date },
      {
        $push: { mouseMovements: { $each: mouseMovements || [] } },
        $inc: {
          clicks: clicks || 0,
          scrollDistance: scrollDistance || 0,
          timeSpent: timeSpent || 0 // Accumulate time spent
        },
        $set: { scrollSpeed: scrollSpeed || 0 }
      },
      { upsert: true, new: true }
    );

    // Calculate stress pattern
    const stressScore = calculateStress(updatedData);
    updatedData.stressScore = stressScore;
    await updatedData.save();

    res.json({ success: true, data: updatedData });
  } catch (err) {
    console.error("Error in /api/track:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API endpoint to get all tracking data
app.get("/api/get-all", async (req, res) => {
  try {
    const allBehaviors = await Behavior.find()
      .sort({ date: -1 }); // Sort by date descending, newest first

    res.json({
      success: true,
      data: allBehaviors,
      total: allBehaviors.length
    });
  } catch (err) {
    console.error("Error in /api/get-all:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Improved stress calculation (including timeSpent)
function calculateStress(data) {
  const movementVariance = data.mouseMovements.length > 1
    ? Math.max(...data.mouseMovements.map(m => m.x)) - Math.min(...data.mouseMovements.map(m => m.x))
    : 0;
  const stress = (data.scrollSpeed * 0.5) + (data.clicks * 2) + (movementVariance * 0.1) + (data.timeSpent * 0.01); // Add time factor
  return parseFloat(stress.toFixed(2));
}

// Graceful shutdown
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  console.log("Received shutdown signal, closing server...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
}