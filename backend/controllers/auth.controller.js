const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 3600000, // 1 hour
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password || typeof password !== 'string') {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token_name', token, COOKIE_OPTIONS);
        return res.status(201).json({
            message: "User registered successfully",
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User profile fetched successfully", user });
    } catch (err) {
        console.error("User profile fetch error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token_name', token, COOKIE_OPTIONS);
        return res.status(200).json({
            message: "User logged in successfully",
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('token_name', COOKIE_OPTIONS);
    res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, getUserProfile, loginUser, logoutUser };