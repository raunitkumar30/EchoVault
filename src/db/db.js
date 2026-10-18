const dotenv = require("dotenv");
const mongoose = require("mongoose");


dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

module.exports = connectDB;