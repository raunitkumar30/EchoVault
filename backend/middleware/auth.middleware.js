const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const token = req.cookies?.token_name;

    if (!token) {
        return res.status(401).json({ message: "No token, unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("jwt error", err.name);
        console.log("jwt error message", err.message);
        return res.status(401).json({ message: "Token is not valid" });
    }
}

module.exports = authMiddleware;
