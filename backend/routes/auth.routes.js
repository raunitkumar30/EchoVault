const express = require("express");
const { registerUser, loginUser, getUserProfile, logoutUser } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


/** POST /api/auth/register - Register a new user */
router.post("/register", registerUser);

/** GET /api/auth/user - Get user profile */
router.get("/me", authMiddleware, getUserProfile);

/** POST /api/auth/login - Login a user */
router.post("/login", loginUser);

/** POST /api/auth/logout - Logout a user */
router.post("/logout", logoutUser);

router.get("/test", (req, res) => {
    console.log("Cookies: ", req.cookies);
    res.json({ message: "Test route", cookies: req.cookies });
});

module.exports = router;