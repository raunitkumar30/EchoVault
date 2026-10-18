const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

router.post('/create', async (req, res) => {
    const token = req.cookies.token_name;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById({
            _id: decoded.id
        });
        console.log(user);
    } catch (err) {
        // console.log("JWT Error:", err.name);
        // console.log("JWT Error Message:", err.message);
        return res.status(401).json({
            message: "Token is not valid"
        });
    }

    console.log(req.body);
    console.log(req.cookies);

    res.send('Post created');
});

module.exports = router;
