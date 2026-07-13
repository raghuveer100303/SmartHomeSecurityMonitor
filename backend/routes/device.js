const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Device = require("../models/device");
const History = require("../models/history");
const sendMail = require("../utils/mailer");
const authMiddleware = require("../middleware/authMiddleware");
// Add Device API
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { name, type } = req.body;

        const device = new Device({
            name,
            type,
            user: req.user.id
        });

        await device.save();
        await History.create({
            user: req.user.id,
    deviceName: device.name,
    action: "Device Added"
});
const user = await User.findById(req.user.id);

await sendMail(
  user.email,
  "Smart Home Security Alert",
  `New device "${device.name}" has been added successfully.`
);

        res.status(201).json({
            message: "Device Added Successfully",
            device
        });
       
    
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
// Get All Devices
router.get("/", authMiddleware, async (req, res) => {
    try {
        const devices = await 
Device.find({ user: req.user.id });
        res.json(devices);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.put("/toggle/:id", authMiddleware, async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        device.status = device.status === "OFF" ? "ON" : "OFF";

        await device.save();
        await History.create({
  user: req.user.id,
  deviceName: device.name,
  action: `Device turned ${device.status}`,
});
const user = await User.findById(req.user.id);

await sendMail(
  user.email,
  "Smart Home Security Alert",
  `Your device "${device.name}" is now ${device.status}.`
);

        res.json({
            message: "Device Status Updated",
            device
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        await Device.findByIdAndDelete(req.params.id);
        await History.create({
    user: req.user.id,
    deviceName: device.name,
    action: "Device Deleted"
});
const user = await User.findById(req.user.id);

await sendMail(
  user.email,
  "Smart Home Security Alert",
  `Your device "${device.name}" has been deleted.`
);

        res.json({
            message: "Device Deleted Successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});
// Dashboard Stats
router.get("/stats", authMiddleware, async (req, res) => {
    try { console.log("Stats API Hit");
        const total = await Device.countDocuments({ user: req.user.id });

        const on = await Device.countDocuments({
            user: req.user.id,
            status: "ON"
        });

        const off = await Device.countDocuments({
            user: req.user.id,
            status: "OFF"
        });

        res.json({
            totalDevices: total,
            onDevices: on,
            offDevices: off
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.get("/history", authMiddleware, async (req, res) => {
    try {

        const history = await History.find({
            user: req.user.id
        }).sort({ time: -1 });

        res.json(history);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
module.exports = router;