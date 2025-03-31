const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema({
  website: { type: String, required: true },
  date: { type: String, required: true },
  mouseMovements: [{ x: Number, y: Number, t: Number }],
  clicks: { type: Number, default: 0 },
  scrollDistance: { type: Number, default: 0 },
  scrollSpeed: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // New field for total time in seconds
  stressScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Behavior", behaviorSchema);