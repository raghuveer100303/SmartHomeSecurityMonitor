const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try { console.log("Request Body:", req.body);
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({
  name,
  email,
  password: hashPassword,
});

console.log("Before Save");

await user.save();

console.log("After Save");

res.status(201).json({
  message: "Registration Successful",
});

  } catch (err) {
    console.log("REGISTER ERROR:");
    console.log(err);

    res.status(500).json({
        message: err.message
    });
}
});
router.post("/login", async (req, res) => {
  try {
    console.log("Login Request:", req.body);

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    console.log("User:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// Get Logged In User
router.get("/me", authMiddleware, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        res.json(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
module.exports = router;