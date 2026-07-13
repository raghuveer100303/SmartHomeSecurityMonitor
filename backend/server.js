require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/device");
const historyRoutes = require("./routes/history");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/history", historyRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/smarthome")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
    res.send("Smart Home Security Monitor Backend Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});