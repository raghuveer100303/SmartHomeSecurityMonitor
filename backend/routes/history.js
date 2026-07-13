const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const History = require("../models/history");

// Get History
router.get("/", authMiddleware, async (req, res) => {
  try {
    const history = await History.find({
      user: req.user.id,
    }).sort({ time: -1 });

    res.json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;