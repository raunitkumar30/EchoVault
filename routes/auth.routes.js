const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();


/** POST /api/auth/register - Register a new user */
router.post("/register", authController.registerUser);


/** POST /api/auth/login - Login a user */
router.post("/login", authController.loginUser);

router.get("/test", (req, res) => {
    console.log("Cookies: ", req.cookies);
    res.json({ message: "Test route", cookies: req.cookies });
});

module.exports = router;