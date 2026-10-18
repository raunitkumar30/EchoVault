const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    const user = await userModel.create({ username, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token_name', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.status(201).json({ message: "User registered successfully", user });

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token_name', token, { httpOnly: true, maxAge: 3600000 });
        return res.status(200).json({ message: "User logged in successfully", user });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { registerUser, loginUser };